import { TaskStatus } from "../nodes/task-node/task-node.types";

export default function getDownstreamTaskStatus(sourceNodeTaskStatus: TaskStatus) {
  if (sourceNodeTaskStatus === TaskStatus.COMPLETE) {
    return TaskStatus.ACTIVE;
  }
  return TaskStatus.INACTIVE;
}
