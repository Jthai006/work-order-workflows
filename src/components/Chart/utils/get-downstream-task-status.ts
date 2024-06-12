import { TaskStatus } from "../nodes/task-node/task-node.types";

export default function getDownstreamTaskStatus(sourceNodeTaskStatuses: TaskStatus[]) {
  if (sourceNodeTaskStatuses.every((status) => status === TaskStatus.COMPLETE)) {
    return TaskStatus.ACTIVE;
  }
  return TaskStatus.INACTIVE;
}
