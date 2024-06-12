import { Node } from "reactflow";

export enum TaskStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  COMPLETE = "complete",
}

export type TaskNodeData = {
  label: string;
  isComplete: boolean;
  taskStatus: TaskStatus;
};

export type TaskNode = Node<TaskNodeData>;
