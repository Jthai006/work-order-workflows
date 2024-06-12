import ReactFlow from "reactflow";
import useInitializeReacflow from "./utils/initialize-reacflow";
import "reactflow/dist/style.css";

export const Chart = () => {
  const { nodes, edges, onEdgesChange, onNodesChange, handleLayout, onConnect, onConnectStart, onConnectEnd } =
    useInitializeReacflow();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button onClick={() => handleLayout()}>Format</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        snapToGrid
      />
    </div>
  );
};
