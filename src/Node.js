import React from 'react';
import { select } from 'd3-selection';
import { useD3Drag } from './use-d3-drag';

function NodeContainer({ width, height }) {
  return (
    <rect
      width={width}
      height={height}
      strokeWidth={1}
      stroke="black"
      fill="transparent"
      rx={3}
    />
  );
}

function NodeTitle({ x, y, children }) {
  return <text x={x} y={y} children={children} fontFamily="sans-serif" />;
}

function NodeLevel({ x, y, children }) {
  return <text x={x} y={y} children={children} fontFamily="sans-serif" />;
}

function NodeDivider({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />;
}

function PersonIconContainerLg({ width, height, x, y }) {
  return (
    <rect
      width={width}
      height={height}
      strokeWidth={1}
      stroke="black"
      fill="transparent"
      x={x}
      y={y}
    />
  );
}

function PersonIcon({ scale = 1, translateX = 0, translateY = 0 }) {
  return (
    <path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      transform={`scale(${scale}) translate(${translateX} ${translateY})`}
    />
  );
}

function MiniNodeList({ children, width = 150, height = 200, x = 0, y = 0 }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke="black"
        strokeWidth={1}
        strokeDasharray={4}
        strokeDashoffset={4}
      />
      {children}
    </g>
  );
}

function PersonIconContainerSm({ width, height }) {
  return (
    <rect
      width={width}
      height={height}
      strokeWidth={1}
      stroke="black"
      fill="transparent"
    />
  );
}

function MiniNode({ parentRef, x, y, scale = 1.5, width = 120, height = 40 }) {
  let [transformCache, cacheTransform] = React.useState(`${x} ${y}`);
  let [cursorState, setCursorState] = React.useState('grab');
  let ref = useD3Drag({
    onDragStart: () => {
      setCursorState('grabbing');
      select(parentRef.current).raise();
    },
    onDrag: (event) => {
      cacheTransform(`${event.x} ${event.y}`);
    },
    onDragEnd: () => {
      setCursorState('grab');
    }
  });

  React.useEffect(() => {
    cacheTransform(`${x} ${y}`);
  }, [x, y]);

  return (
    <g
      ref={ref}
      transform={`translate(${transformCache})`}
      cursor={cursorState}
    >
      <rect
        width={width}
        height={height}
        strokeWidth={1}
        // stroke="black"
        fill="transparent"
      />
      <PersonIconContainerSm
        width={40}
        height={40}
        strokeWidth={1}
        stroke="black"
        fill="transparent"
      />
      <PersonIcon scale={scale} translateX={1} />
    </g>
  );
}

function NodeChildCount({ x, y, children, onClick }) {
  return (
    <text
      x={x}
      y={y}
      children={children}
      fontFamily="sans-serif"
      cursor="pointer"
      onClick={onClick}
    />
  );
}

export function Node({ node, computeLayout, cacheLinks, cacheNodes }) {
  let nodeWidth = 400;
  let nodeHeight = 400;
  let nodePaddingX = 16;
  let nodePaddingY = 24;
  let dividerYPos = 36;
  let levelPaddingRight = 16;
  let widthDivisor = 2.25;
  let heightDivisor = 2;
  let ref = React.useRef();

  return (
    <g transform={`translate(${node?.x} ${node?.y})`} ref={ref}>
      <NodeContainer width={nodeWidth} height={nodeHeight} />
      <NodeTitle
        x={nodePaddingX}
        y={nodePaddingY}
        children={node.data.name}
        fontFamily="sans-serif"
      />
      <NodeLevel
        x={nodeWidth - (nodePaddingX + levelPaddingRight)}
        y={nodePaddingY}
        children={node.depth}
        fontFamily="sans-serif"
      />
      <NodeDivider
        x1={nodePaddingX}
        y1={dividerYPos}
        x2={nodeWidth - nodePaddingX}
        y2={dividerYPos}
        stroke="black"
      />
      <PersonIconContainerLg
        width={nodeWidth / widthDivisor}
        height={nodeHeight / heightDivisor}
        strokeWidth={1}
        stroke="black"
        fill="transparent"
        x={nodePaddingX}
        y={60}
      />
      <PersonIcon scale={2.5} translateX={30} translateY={50} />
      <MiniNodeList x={235} y={56}>
        <MiniNode parentRef={ref} x={240} y={60} />
        <MiniNode parentRef={ref} x={240} y={110} />
      </MiniNodeList>
      <NodeChildCount
        x={nodePaddingX}
        y={nodeHeight - nodePaddingY}
        fontFamily="sans-serif"
        children={node.data.children?.length}
        onClick={() => {
          if (node.children) {
            node.children = null;
          } else {
            node.children = node._children;
          }

          let [root] = node.ancestors().slice(-1);

          computeLayout(root);
          cacheNodes(root.descendants().reverse());
          cacheLinks(root.links());
        }}
      />
    </g>
  );
}

export function NodeGroup({ children }) {
  return <g children={children} />;
}
