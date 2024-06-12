import { useCallback } from "react";
import { Node, useReactFlow } from "reactflow";

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

      setNodes((nodes) => {
        const targetNode = getNode(targetNodeId);
        return [
          ...nodes.map((node) =>
            downstreamNodes.includes(node.id)
              ? {
                  ...node,
                  position: {
                    x: node.position.x,
                    y: node.position.y + 100,
                  },
                }
              : node,
          ),
          {
            id: newNodeId,
            type: "task",
            data: { label: newNodeId },
            position: { x: targetNode?.position.x, y: targetNode?.position.y },
          } as Node,
        ];
      });

      const edges = getEdges();
      const edge = getEdge(edgeId);
      if (!edge) {
        throw new Error(`handleAddNode - Unable to find edge ${edgeId}`);
      }

      const updatedEdge = {
        ...edge,
        source: newNodeId,
        id: `${newNodeId}->${edge.target}`,
      };
      const remainingEdges = edges.filter((e) => edge.id !== e.id);
      const newEdge = {
        id: `${sourceNodeId}->${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
        type: "add",
      };

      setEdges([...remainingEdges, updatedEdge, newEdge]);
    },
    [getDownstreamNodes, setNodes, getEdges, getEdge, setEdges, getNode],
  );

  return insertNode;
}
