import { TaskNode, TaskStatus } from "./nodes/task-node/task-node.types";

let currIndex = 0;
export const getTaskName = () => {
  const taskName = taskList[currIndex];
  currIndex += 1;
  return taskName;
};

export const taskList = [
  "CNC Milling",
  "CNC Turning",
  "Drilling",
  "Tapping",
  "Boring",
  "Reaming",
  "Threading",
  "Grinding",
  "Honing",
  "Lapping",
  "Surface Finishing",
  "Deburring",
  "Welding",
  "Brazing",
  "Soldering",
  "Heat Treating",
  "Annealing",
  "Hardening",
  "Tempering",
  "Shot Peening",
  "Sand Blasting",
  "Laser Cutting",
  "Plasma Cutting",
  "Water Jet Cutting",
  "EDM",
  "3D Printing",
  "Injection Molding",
  "Blow Molding",
  "Extrusion",
  "Casting",
  "Forging",
  "Stamping",
  "Punching",
  "Bending",
  "Roll Forming",
  "Shearing",
  "Riveting",
  "Fastening",
  "Assembly Line Operations",
  "Quality Control Inspection",
  "CNC Machine Programming",
  "CAM Programming",
  "CAD Modeling",
];

export const initialNodes: TaskNode[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: getTaskName(), taskStatus: TaskStatus.ACTIVE },
    type: "task",
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: getTaskName(), taskStatus: TaskStatus.INACTIVE },
    type: "task",
  },
  {
    id: "3",
    position: { x: 0, y: 200 },
    data: { label: getTaskName(), taskStatus: TaskStatus.INACTIVE },
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
