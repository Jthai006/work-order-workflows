import ReactFlow, { MarkerType } from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
    {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: '1' }
    },
    {
        id: '2',
        position: { x: 0, y: 100 },
        data: { label: '2' }
    },
    {
        id: '3',
        position: { x: 0, y: 200 },
        data: { label: '3' }
    },
];
const initialEdges = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        markerend: {
          type: MarkerType.ArrowClosed,
         }
    },
    {
        id: 'e2-3',
        source: '2',
        target: '3',
        markerend: {
          type: MarkerType.ArrowClosed,
         }
    },
];

export const Chart = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} />
    </div>
  );
}
