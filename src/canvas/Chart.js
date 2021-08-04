import React from 'react';
import { Stage, Layer } from 'react-konva';
import { useD3Tree } from '../use-d3-tree';
import { useD3TreeCurve } from '../use-d3-tree-curve';
import { Node, NodeGroup } from './Node';
import { Link, LinkGroup } from './Link';

const NodeGroupMemo = React.memo(NodeGroup);
const NodeMemo = React.memo(Node);
const LinkGroupMemo = React.memo(LinkGroup);
const LinkMemo = React.memo(Link);
const CanvasMemo = React.memo(Canvas);

export function Chart({
  data,
  nodeWidth = 100,
  nodeHeight = 100,
  nodeMarginX = 10,
  nodeMarginY = 10,
  expandDepth = 2,
  viewBox
}) {
  let {
    linksCache,
    nodesCache,
    computeLayout,
    cacheNodes,
    cacheLinks
  } = useD3Tree({
    data,
    nodeWidth,
    nodeHeight,
    nodeMarginX,
    nodeMarginY,
    expandDepth
  });
  let { pointsCache } = useD3TreeCurve({
    nodeWidth,
    nodeHeight,
    nodeMarginY,
    links: linksCache
  });
  let stageRef = React.useRef();

  return (
    <CanvasMemo stageRef={stageRef}>
      <LinkGroupMemo>
        <For
          of={pointsCache.map((points) => ({
            points: points.flatMap((point) => [point.x, point.y])
          }))}
        >
          <LinkMemo />
        </For>
      </LinkGroupMemo>
      <NodeGroupMemo>
        <For of={nodesCache.map((node) => ({ node }))}>
          <NodeMemo
            computeLayout={computeLayout}
            cacheNodes={cacheNodes}
            cacheLinks={cacheLinks}
            stageRef={stageRef}
          />
        </For>
      </NodeGroupMemo>
    </CanvasMemo>
  );
}

function Canvas({ children, stageRef }) {
  let scaleBy = 1.11;

  return (
    <Stage
      draggable
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={(e) => {
        e.evt.preventDefault();

        let oldScale = stageRef.current.scaleX();
        let pointer = stageRef.current.getPointerPosition();

        let mousePointTo = {
          x: (pointer.x - stageRef.current.x()) / oldScale,
          y: (pointer.y - stageRef.current.y()) / oldScale
        };

        let newScale =
          e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stageRef.current.scale({ x: newScale, y: newScale });

        let newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale
        };
        stageRef.current.position(newPos);
      }}
    >
      <Layer children={children} />
    </Stage>
  );
}

function For({ of, children }) {
  let child = React.Children.only(children);
  let elements = of.map((props, idx) =>
    React.cloneElement(child, {
      key: props.id ?? idx,
      ...props
    })
  );

  return React.createElement(React.Fragment, null, elements);
}
