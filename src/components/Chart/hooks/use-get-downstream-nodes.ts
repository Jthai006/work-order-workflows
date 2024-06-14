import { useReactFlow } from "reactflow";

import { useCallback } from "react";

export default function useGetDownstreamNodes() {
  const { getEdges } = useReactFlow();

  const getDownstreamNodes = (initialNodeId: string): string[] => {
    const edges = getEdges();
    const startingEdges = edges.filter(({ source }) => source === initialNodeId);

    if (!startingEdges.length) {
      return [initialNodeId];
    }

    return [initialNodeId, ...startingEdges.flatMap(({ target }) => getDownstreamNodes(target))];
  };

  return useCallback(getDownstreamNodes, [getDownstreamNodes, getEdges]);
}
