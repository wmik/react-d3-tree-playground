import { line, curveLinear } from 'd3-shape';

export function LinkGroup({ children }) {
  return (
    <g
      children={children}
      fill="none"
      stroke="#555"
      strokeOpacity={0.5}
      strokeWidth={1.5}
    />
  );
}

export function Link({ points }) {
  return <path d={computeLinkAngle(points)} />;
}

let computeLinkAngle = line()
  .x((node) => node.x)
  .y((node) => node.y)
  .curve(curveLinear);
