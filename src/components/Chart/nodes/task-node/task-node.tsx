import { memo, useMemo, useState, useCallback } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import "./task-node.css";
import { TaskNodeData, TaskStatus } from "./task-node.types";
import useCompleteTask from "../../hooks/use-complete-task";
import { TaskNodeStatusColors } from "../../../../constants";
import { taskList } from "../../config";

const TaskNode = memo(({ id: nodeId, data }: NodeProps<TaskNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || nodeId);
  const { deleteElements, setNodes } = useReactFlow();
  const completeTask = useCompleteTask();

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      deleteElements({ nodes: [{ id: nodeId }] });
    },
    [nodeId, deleteElements],
  );

  const toggleEditing = useCallback(() => {
    if (isEditing) {
      setNodes((nodes) =>
        nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, label } } : node)),
      );
    }
    setIsEditing(!isEditing);
  }, [isEditing, label, nodeId, setNodes]);

  const handleComplete = useCallback(() => {
    completeTask(nodeId);
  }, [completeTask, nodeId]);

  const nodeContent = useMemo(() => {
    if (isEditing) {
      return (
        <select className="label-input" onChange={(e) => setLabel(e.target.value)} value={label}>
          {taskList.map((task) => (
            <option value={task}>{task}</option>
          ))}
        </select>
      );
    }
    return <p>{label}</p>;
  }, [isEditing, label]);

  const editButtonClasses = isEditing ? "action-btn edit-btn-confirm" : "action-btn edit-btn";
  const editButtonTooltip = isEditing ? "Save Task" : "Edit Task";

  const disableComplete = data.taskStatus !== TaskStatus.ACTIVE;

  return (
    <>
      <Handle className="handle" type="target" position={Position.Top} style={{ background: "#555" }} />
      <div
        style={{ backgroundColor: TaskNodeStatusColors[data.taskStatus] }}
        className="flex items-center justify-center relative p-2.5 rounded h-full"
      >
        {nodeContent}
        <div className="action-container">
          <div className="flex">
            <button className={editButtonClasses} onClick={toggleEditing}>
              <i data-tooltip={editButtonTooltip} className="fa-solid fa-pen-to-square"></i>
            </button>
            <div className="pr-1"></div>
            <button className="action-btn complete-btn" onClick={handleComplete} disabled={disableComplete}>
              <i data-tooltip="Complete Task" className="fa-solid fa-circle-check"></i>
            </button>
          </div>
          <button className="action-btn delete-btn" onClick={handleDelete}>
            <i data-tooltip="Delete Task" className="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: "#555" }} />
    </>
  );
});

export default TaskNode;
