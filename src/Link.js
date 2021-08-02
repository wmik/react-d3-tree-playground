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

export function Link({ link }) {
  return <path d={link} />;
}
