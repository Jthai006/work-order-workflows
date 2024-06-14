import { useCallback, useEffect, useRef } from "react";
import {
  Edge,
  Node,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnNodesDelete,
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import Dagre, { Label } from "@dagrejs/dagre";
import { TaskNode, TaskNodeData, TaskStatus } from "../nodes/task-node/task-node.types";
import getDownstreamTaskStatus from "../utils/get-downstream-task-status";
import { getTaskName, initialEdges, initialNodes } from "../config";
import useValidateFlow from "./use-validate-flow";

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: { direction: string }) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });
  nodes.forEach((node) => {
    return g.setNode(node.id, { height: node.height, width: node.width } as Label);
  });

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.width || 300) / 2;
      const y = position.y - (node.height || 80) / 2;
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const getInitialFlow = (): { flow: { nodes: Node[]; edges: Edge[] }; updatedAt: number | null } => {
  const customFlowJson = localStorage.getItem("custom-flow");
  if (!customFlowJson) return { flow: { nodes: initialNodes, edges: initialEdges }, updatedAt: null };

  try {
    const parsedFlow = JSON.parse(customFlowJson);
    return parsedFlow;
  } catch (error) {
    console.error("Failed to parse custom flow from localStorage", error);
    return { flow: { nodes: initialNodes, edges: initialEdges }, updatedAt: null };
  }
};

export default function useInitializeReacflow() {
  const { fitView, screenToFlowPosition, toObject, getNode } = useReactFlow();
  const validateFlow = useValidateFlow();
  const connectingNodeId = useRef<string | null>(null);

  const { flow, updatedAt } = getInitialFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);

  // Effects
  // Handle auto saving of flow
  useEffect(() => {
    localStorage.setItem("custom-flow", JSON.stringify({ flow: toObject(), updatedAt: new Date().getTime() }));
  }, [nodes, edges, toObject]);

  // Handles validating flow
  useEffect(() => {
    const isValidFlow = validateFlow();
    console.log({ isValidFlow });
  }, [nodes, edges, validateFlow]);

  // Callbacks
  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const onReset = useCallback(() => {
    localStorage.removeItem("custom-flow");
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setEdges, setNodes]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;
      setEdges((eds) => addEdge({ ...params, type: "add" }, eds));
    },
    [setEdges],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;
      const connectingNode = getNode(connectingNodeId.current);
      if (!connectingNode) {
        throw new Error(`onConnectEnd - Could not find node ${connectingNodeId.current}`);
      }

      const targetIsPane = (event.target as HTMLElement)?.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = `${new Date().getTime()}`;
        const newNode: TaskNode = {
          id,
          position: screenToFlowPosition({
            // @ts-expect-error clientX on event
            x: event.clientX,
            // @ts-expect-error clientY on event
            y: event.clientY,
          }),
          data: {
            label: getTaskName(),
            taskStatus: getDownstreamTaskStatus([connectingNode.data.taskStatus]),
          },
          type: "task",
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => [...eds].concat({ id, source: connectingNodeId.current, target: id, type: "add" } as Edge));
      }
    },
    [getNode, screenToFlowPosition, setEdges, setNodes],
  );

  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted) => {
      const downstreamNodeIds: string[] = [];
      const updatedEdges: Edge[] = deleted.reduce((acc, node) => {
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);
        downstreamNodeIds.push(...outgoers.map(({ id }) => id));
        const connectedEdges = getConnectedEdges([node], edges);

        const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));
        const remainingEdgeIds = remainingEdges.map(({ id }) => id);

        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => {
            const targetNode = getNode(target);
            if (!targetNode) {
              throw new Error(`onNodesDelete - Could not find node ${targetNode}`);
            }

            return {
              id: `e${source}->${target}`,
              source,
              target,
              type: targetNode.data.taskStatus !== TaskStatus.COMPLETE ? "add" : undefined,
            };
          }),
        );

        // Needed for case when incomer and outgoer is already connected
        const filterDuplicateCreatedEdge = createdEdges.filter(({ id }) => !remainingEdgeIds.includes(id));
        return [...remainingEdges, ...filterDuplicateCreatedEdge];
      }, edges);

      setEdges(updatedEdges);

      setNodes((nodes) =>
        nodes.map((node) => {
          if (downstreamNodeIds.includes(node.id)) {
            const upstreamNodes = getIncomers<TaskNodeData>(node, nodes, updatedEdges);
            const upstreamNodesTaskStatuses = upstreamNodes.map(({ data }) => data.taskStatus);
            const taskStatus = getDownstreamTaskStatus(upstreamNodesTaskStatuses, node.data.taskStatus);

            return {
              ...node,
              data: {
                ...node.data,
                taskStatus,
              },
            };
          }
          return node;
        }),
      );
    },
    [setEdges, edges, setNodes, nodes, getNode],
  );

  return {
    nodes,
    edges,
    updatedAt: updatedAt ? new Date(updatedAt).toString() : "N/a",
    onNodesChange,
    onEdgesChange,
    onLayout,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onNodesDelete,
    onReset,
  };
}
