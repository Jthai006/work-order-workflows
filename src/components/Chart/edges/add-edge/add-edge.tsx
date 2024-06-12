import { EdgeProps, getBezierPath, getEdgeCenter } from "react-flow-renderer";
import "./add-edd.css";
import { memo, useCallback } from "react";
import useInsertNodeBetween from "../../hooks/use-insert-node-between";

const foreignObjectSize = 20;

const AddEdge = memo(
  ({
    id: edgeId,
    sourceX,
    sourceY,
    targetX,
    targetY,
    source: sourceNodeId,
    target: targetNodeId,
    sourcePosition,
    targetPosition,
    style = {},
  }: EdgeProps) => {
    const insertNode = useInsertNodeBetween();

    const edgePath = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });

    const handleInsertNode = useCallback(
      () => insertNode(sourceNodeId, targetNodeId, edgeId),
      [edgeId, insertNode, sourceNodeId, targetNodeId],
    );

    return (
      <>
        <path id={edgeId} style={style} className="react-flow__edge-path" d={edgePath} />
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={edgeCenterX - foreignObjectSize / 2}
          y={edgeCenterY - foreignObjectSize / 2}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="flex justify-center items-center h-full">
            <button className="addButton" onClick={handleInsertNode}>
              <i className="fa-solid fa-circle-plus"></i>
            </button>
          </div>
        </foreignObject>
      </>
    );
  },
);

export default AddEdge;
