import ReactFlow from "reactflow";
import useInitializeReacflow from "./hooks/use-initialize-reacflow";
import "reactflow/dist/style.css";
import TaskNode from "./nodes/task-node";
import AddEdge from "./edges/add-edge";
import Legend from "../Legend/legend";

const nodeTypes = {
  task: TaskNode,
};

const edgeTypes = {
  add: AddEdge,
};

export const Chart = () => {
  const {
    nodes,
    edges,
    updatedAt,
    onEdgesChange,
    onNodesChange,
    onLayout,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onNodesDelete,
    onReset,
  } = useInitializeReacflow();

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center w-full">
        <button className="p-1" onClick={onLayout}>
          Format
        </button>
        <div className="pr-1"></div>
        <button className="p-1" onClick={onReset}>
          Reset
        </button>
      </div>
      <div className="pt-2"></div>
      <Legend />
      <small>Last save: {updatedAt}</small>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodesDelete={onNodesDelete}
        fitView
        snapToGrid
      />
    </div>
  );
};
