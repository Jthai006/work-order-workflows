import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import { TaskNode, TaskStatus } from "../nodes/task-node/task-node.types";
import getDownstreamTaskStatus from "../utils/get-downstream-task-status";
import { getTaskName } from "../config";
import useGetDownstreamNodes from "./use-get-downstream-nodes";

export default function useInsertNodeBetween() {
  const { getEdge, getNode, setNodes, setEdges } = useReactFlow();
  const getDownstreamNodes = useGetDownstreamNodes();

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
              label: getTaskName(),
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
        id: `e${newNodeId}->${edge.target}`,
      };

      const newEdge = {
        id: `e${sourceNodeId}->${newNodeId}`,
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
