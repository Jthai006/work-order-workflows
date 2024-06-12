import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import { TaskNode, TaskStatus } from "../nodes/task-node/task-node.types";
import getDownstreamTaskStatus from "../utils/get-downstream-task-status";

export default function useInsertNodeBetween() {
  const { getEdge, getNode, getEdges, setNodes, setEdges } = useReactFlow();

  const getDownstreamNodes = useCallback(
    (initialNodeId: string): string[] => {
      const edges = getEdges();
      const startingEdges = edges.filter(({ source }) => source === initialNodeId);

      if (!startingEdges.length) {
        return [initialNodeId];
      }

      return [initialNodeId, ...startingEdges.flatMap(({ target }) => getDownstreamNodes(target))];
    },
    [getEdges],
  );

  const insertNode = useCallback(
    (sourceNodeId: string, targetNodeId: string, edgeId: string) => {
      const newNodeId = `${new Date().getTime()}`;
      const downstreamNodes = getDownstreamNodes(targetNodeId);
      const targetNode = getNode(targetNodeId);
      const sourceNode = getNode(sourceNodeId);

      if (!targetNode) {
        throw new Error(`insertNode - Unable to find targetNode: ${targetNodeId}`);
      }
      if (!sourceNode) {
        throw new Error(`insertNode - Unable to find sourceNode: ${sourceNodeId}`);
      }

      setNodes((nodes) => {
        return [
          ...nodes.map((node) => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  taskStatus: TaskStatus.INACTIVE,
                },
                position: {
                  x: node.position.x,
                  y: node.position.y + 100,
                },
              };
            }
            if (downstreamNodes.includes(node.id)) {
              return {
                ...node,
                position: {
                  x: node.position.x,
                  y: node.position.y + 100,
                },
              };
            }
            return node;
          }),
          {
            id: newNodeId,
            type: "task",
            data: {
              label: newNodeId,
              isComplete: false,
              taskStatus: getDownstreamTaskStatus([sourceNode.data.taskStatus]),
            },
            position: { x: targetNode.position.x, y: targetNode.position.y },
          } as TaskNode,
        ];
      });

      const edge = getEdge(edgeId);

      if (!edge) {
        throw new Error(`insertNode - Unable to find edge ${edgeId}`);
      }

      const updatedEdge = {
        ...edge,
        source: newNodeId,
        id: `${newNodeId}->${edge.target}`,
      };

      const newEdge = {
        id: `${sourceNodeId}->${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
        type: "add",
      };

      setEdges((prevEdges) => [...prevEdges.filter((e) => e.id !== edge.id), updatedEdge, newEdge]);
    },
    [getDownstreamNodes, getNode, setNodes, getEdge, setEdges],
  );

  return insertNode;
}
