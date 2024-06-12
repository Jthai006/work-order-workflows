import ReactFlow from "reactflow";
import useInitializeReacflow from "./hooks/use-initialize-reacflow";
import "reactflow/dist/style.css";
import TaskNode from "./nodes/task-node";
import AddEdge from "./edges/add-edge";

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
    <div style={{ height: "100%" }}>
      <div className="flex justify-center w-full">
        <button onClick={onLayout}>Format</button>
        <div className="pr-1"></div>
        <button onClick={onReset}>Reset</button>
      </div>
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
