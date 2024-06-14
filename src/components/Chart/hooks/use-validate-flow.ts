import { Node, useReactFlow } from "reactflow";

import { useCallback } from "react";
import useGetDownstreamNodes from "./use-get-downstream-nodes";

const CNC_TASK = "CNC Milling";
const QUALITY_CONTROL_INSPECTION = "Quality Control Inspection";

export default function useValidateFlow() {
  const { getNode, getNodes } = useReactFlow();
  const getDownstreamNodes = useGetDownstreamNodes();

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
