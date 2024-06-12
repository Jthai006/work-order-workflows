import { TaskNode, TaskStatus } from "./nodes/task-node/task-node.types";

export const initialNodes: TaskNode[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "1", isComplete: false, taskStatus: TaskStatus.ACTIVE },
    type: "task",
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "2", isComplete: false, taskStatus: TaskStatus.INACTIVE },
    type: "task",
  },
  {
    id: "3",
    position: { x: 0, y: 200 },
    data: { label: "3", isComplete: false, taskStatus: TaskStatus.INACTIVE },
    type: "task",
  },
];
export const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",

    type: "add",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",

    type: "add",
  },
];
