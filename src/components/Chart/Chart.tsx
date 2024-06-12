import ReactFlow from "reactflow";
import useInitializeReacflow from "./hooks/use-initialize-reacflow";
import "reactflow/dist/style.css";
import TaskNode from "./nodes/task-node";

const nodeTypes = {
  task: TaskNode,
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
  console.log(edges);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button onClick={() => handleLayout()}>Format</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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
