import { Line, Group } from 'react-konva';

export function LinkGroup({ children }) {
  return <Group children={children} />;
}

export function Link({ points }) {
  return (
    <Line
      points={points}
      fill="blue"
      stroke="#555"
      strokeOpacity={0.5}
      strokeWidth={1.5}
    />
  );
}
