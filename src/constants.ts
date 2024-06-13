import { TaskStatus } from "./components/Chart/nodes/task-node/task-node.types";

export const TaskNodeStatusColors = {
  [TaskStatus.INACTIVE]: "#DDA0DD",
  [TaskStatus.ACTIVE]: "#a0b2dd",
  [TaskStatus.COMPLETE]: "#a0dda7",
};
