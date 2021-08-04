import React from 'react';
import { Rect, Line, Group, Path, Text } from 'react-konva';

function NodeContainer({ width, height, x, y }) {
  return (
    <Rect
      x={x}
      y={y}
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
  return <Text x={x} y={y} text={children} fontFamily="sans-serif" />;
}

function NodeLevel({ x, y, children }) {
  return <Text x={x} y={y} text={children} fontFamily="sans-serif" />;
}

function NodeDivider({ x1, y1, x2, y2 }) {
  return <Line points={[x1, y1, x2, y2]} stroke="black" strokeWidth={1} />;
}

function PersonIconContainerLg({ width, height, x, y }) {
  return (
    <Rect
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
    <Path
      data="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      scale={{ x: scale, y: scale }}
      x={translateX}
      y={translateY}
      fill="black"
    />
  );
}

function MiniNodeList({ children, width = 150, height = 200, x = 0, y = 0 }) {
  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke="black"
        strokeWidth={1}
        dash={[4, 4]}
      />
      {children}
    </Group>
  );
}

function PersonIconContainerSm({ width, height, x, y }) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      strokeWidth={1}
      stroke="black"
      fill="transparent"
    />
  );
}

function MiniNode({ x, y, scale = 1.5, width = 120, height = 40 }) {
  return (
    <Group draggable>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        strokeWidth={1}
        // stroke="black"
        fill="transparent"
      />
      <PersonIconContainerSm
        x={x}
        y={y}
        width={40}
        height={40}
        strokeWidth={1}
        stroke="black"
        fill="transparent"
      />
      <PersonIcon scale={scale} translateX={x + 2} translateY={y} />
    </Group>
  );
}

function NodeChildCount({ x, y, children, onClick, stageRef }) {
  return (
    <Text
      x={x}
      y={y}
      text={children}
      fontFamily="sans-serif"
      onClick={onClick}
      onMouseEnter={(e) => {
        stageRef.current.container().style.cursor = 'pointer';
      }}
      onMouseLeave={(e) => {
        stageRef.current.container().style.cursor = 'default';
      }}
    />
  );
}

export function Node({
  node,
  computeLayout,
  cacheLinks,
  cacheNodes,
  stageRef
}) {
  let nodeWidth = 400;
  let nodeHeight = 400;
  let nodePaddingX = 16;
  let nodePaddingY = 24;
  let dividerYPos = 40;
  let levelPaddingRight = 16;
  let widthDivisor = 2.25;
  let heightDivisor = 2;

  return (
    <Group>
      <NodeContainer
        x={node.x}
        y={node.y}
        width={nodeWidth}
        height={nodeHeight}
      />
      <NodeTitle
        x={node.x + nodePaddingX}
        y={node.y + nodePaddingY}
        children={node.data.name}
        fontFamily="sans-serif"
      />
      <NodeLevel
        x={node.x + (nodeWidth - (nodePaddingX + levelPaddingRight))}
        y={node.y + nodePaddingY}
        children={node.depth}
        fontFamily="sans-serif"
      />
      <NodeDivider
        x1={node.x + nodePaddingX}
        y1={node.y + dividerYPos}
        x2={node.x + (nodeWidth - nodePaddingX)}
        y2={node.y + dividerYPos}
        stroke="black"
      />
      <PersonIconContainerLg
        width={nodeWidth / widthDivisor}
        height={nodeHeight / heightDivisor}
        strokeWidth={1}
        stroke="black"
        fill="transparent"
        x={node.x + nodePaddingX}
        y={node.y + 60}
      />
      <PersonIcon
        scale={4.5}
        translateX={node.x + 50}
        translateY={node.y + 100}
      />
      <MiniNodeList x={node.x + 235} y={node.y + 56}>
        <MiniNode x={node.x + 240} y={node.y + 60} />
        <MiniNode x={node.x + 240} y={node.y + 110} />
      </MiniNodeList>
      <NodeChildCount
        x={node.x + nodePaddingX}
        y={node.y + (nodeHeight - nodePaddingY)}
        fontFamily="sans-serif"
        children={node.data.children?.length}
        stageRef={stageRef}
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
    </Group>
  );
}

export function NodeGroup({ children }) {
  return <Group children={children} />;
}
