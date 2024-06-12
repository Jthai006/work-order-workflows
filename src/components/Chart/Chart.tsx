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
    onEdgesChange,
    onNodesChange,
    handleLayout,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onNodesDelete,
  } = useInitializeReacflow();

  return (
    <div style={{ height: "100%" }}>
      <button onClick={() => handleLayout()}>Format</button>
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
