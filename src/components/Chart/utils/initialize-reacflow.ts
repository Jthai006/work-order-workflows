import { useCallback, useRef } from "react";
import {
  Edge,
  MarkerType,
  Node,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import Dagre, { Label } from "@dagrejs/dagre";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "1" },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "2" },
  },
  {
    id: "3",
    position: { x: 0, y: 200 },
    data: { label: "3" },
  },
];
const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    markerend: {
      type: MarkerType.Arrow,
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    markerend: {
      type: MarkerType.Arrow,
    },
  },
];

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: { direction: string }) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node as Label));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.width || 300) / 2;
      const y = position.y - (node.height || 80) / 2;
      console.log({ prevX: position.x, prevY: position.y, x, y });
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export default function useInitializeReacflow() {
  const { fitView, screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      console.log(event);
      if (!connectingNodeId.current) return;

      // @ts-expect-error classList does exist on event.target
      const targetIsPane = event.target?.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = `${new Date().getTime()}`;
        const newNode = {
          id,
          position: screenToFlowPosition({
            // @ts-expect-error clientX on event
            x: event.clientX,
            // @ts-expect-error clientY on event
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => [...eds].concat({ id, source: connectingNodeId.current, target: id } as Edge));
      }
    },
    [screenToFlowPosition, setEdges, setNodes],
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    handleLayout,
    onConnect,
    onConnectStart,
    onConnectEnd,
  };
}
