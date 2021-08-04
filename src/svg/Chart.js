import React from 'react';
import { useD3Tree } from '../use-d3-tree';
import { useD3Zoom } from '../use-d3-zoom';
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
  let { transformCache, elementRef } = useD3Zoom({
    extent: [
      [0, 0],
      [1080, 960]
    ],
    scaleExtent: [0, 8]
  });

  return (
    <svg viewBox={viewBox} ref={elementRef}>
      <CanvasMemo transform={transformCache}>
        <LinkGroupMemo>
          <For of={pointsCache.map((points) => ({ points }))}>
            <LinkMemo />
          </For>
        </LinkGroupMemo>
        <NodeGroupMemo>
          <For of={nodesCache.map((node) => ({ node }))}>
            <NodeMemo
              computeLayout={computeLayout}
              cacheNodes={cacheNodes}
              cacheLinks={cacheLinks}
            />
          </For>
        </NodeGroupMemo>
      </CanvasMemo>
    </svg>
  );
}

function Canvas({ children, transform }) {
  let transformation = transform ?? 'scale(1)';
  return <g children={children} transform={`${transformation}`} />;
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
