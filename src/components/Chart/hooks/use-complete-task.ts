import { getConnectedEdges, getIncomers, getOutgoers, useReactFlow } from "reactflow";
import { TaskNode, TaskNodeData, TaskStatus } from "../nodes/task-node/task-node.types";
import { useCallback } from "react";

export default function useCompleteTask() {
  const { getNode, getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  return useCallback(
    (nodeId: string) => {
      const node: TaskNode | undefined = getNode(nodeId);
      if (!node) {
        throw new Error(`useCompleteTask - Unable to get node ${nodeId}`);
      }

      const nodes = getNodes();
      const edges = getEdges();
      const downstreamNodes = getOutgoers<TaskNodeData>(node, nodes, edges);

      const downstreamNodesToActivate = downstreamNodes.filter((downstreamNode) => {
        const upstreamNodes = getIncomers<TaskNodeData>(downstreamNode, nodes, edges);
        return upstreamNodes.every(
          (upstreamNode) => upstreamNode.id === nodeId || upstreamNode.data.taskStatus === TaskStatus.COMPLETE,
        );
      });

      const downstreamNodeIdsToActivate = downstreamNodesToActivate.map(({ id }) => id);

      setNodes((currNodes) =>
        currNodes.map((currNode) => {
          if (currNode.id === nodeId) {
            return {
              ...currNode,
              data: { ...currNode.data, taskStatus: TaskStatus.COMPLETE },
            };
          }

          if (downstreamNodeIdsToActivate.includes(currNode.id)) {
            return {
              ...currNode,
              data: { ...currNode.data, taskStatus: TaskStatus.ACTIVE },
            };
          }

          return currNode;
        }),
      );

      const connectedEdges = getConnectedEdges([node], edges);
      const upstreamEdges = connectedEdges.filter(({ target }) => target === nodeId);
      const upstreamEdgeIds = upstreamEdges.map(({ id }) => id);

      setEdges((currEdges) =>
        currEdges.map((currEdge) => {
          if (upstreamEdgeIds.includes(currEdge.id)) {
            return {
              ...currEdge,
              type: undefined,
            };
          }
          return currEdge;
        }),
      );
    },
    [getEdges, getNode, getNodes, setEdges, setNodes],
  );
}
