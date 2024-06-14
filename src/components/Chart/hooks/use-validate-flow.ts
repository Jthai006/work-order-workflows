import { Node, useReactFlow } from "reactflow";

import { useCallback } from "react";

const CNC_TASK = "CNC Milling";
const QUALITY_CONTROL_INSPECTION = "Quality Control Inspection";

export default function useValidateFlow() {
  const { getNode, getNodes, getEdges } = useReactFlow();

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

  return useCallback(() => {
    const nodes = getNodes();
    const cncMillingNodes = nodes.filter(({ data }) => data.label === CNC_TASK);
    const allCncMillingNodesHaveQualityCheck = cncMillingNodes.every((node) => {
      const downstreamNodeIds = getDownstreamNodes(node.id);
      const downstreamNodes = downstreamNodeIds.map((nodeId) => getNode(nodeId)).filter((node) => node) as Node[];

      return downstreamNodes.some(({ data }) => data.label === QUALITY_CONTROL_INSPECTION);
    });
    return allCncMillingNodesHaveQualityCheck;
  }, [getDownstreamNodes, getNode, getNodes]);
}
