import { memo } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import "./task-node.css";
import { TaskNodeData } from "./task-node.types";

const TaskNode = memo(({ id: nodeId, data }: NodeProps<TaskNodeData>) => {
  const { deleteElements } = useReactFlow();
  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id: nodeId }] });
  };
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: "#555" }} />
      <div className="flex items-center justify-center relative">
        <div>{data.label || nodeId}</div>
        <button className="delete-btn" onClick={handleDelete}>
          <i className="fa-regular fa-circle-xmark"></i>
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: "#555" }} />
    </>
  );
});

export default TaskNode;
