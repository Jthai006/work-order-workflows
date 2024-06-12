import { Node } from "reactflow";

export type TaskNodeData = {
  label: string;
};

export type TaskNode = Node<TaskNodeData>;
