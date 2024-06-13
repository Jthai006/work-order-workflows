import { TaskNodeStatusColors } from "../../constants";
import { TaskStatus } from "../Chart/nodes/task-node/task-node.types";

type TaskColorStatusProps = {
  color: string;
  status: TaskStatus;
};
const TaskColorStatus = ({ color, status }: TaskColorStatusProps) => {
  return (
    <div className="flex flex-col justify-center align-center">
      <div className="w-20 h-3" style={{ backgroundColor: color }} />
      {status}
    </div>
  );
};

export default function Legend() {
  return (
    <div className="flex justify-center gap-2.5">
      {Object.entries(TaskNodeStatusColors).map(([taskStatus, color]) => (
        <TaskColorStatus color={color} status={taskStatus as TaskStatus} />
      ))}
    </div>
  );
}
