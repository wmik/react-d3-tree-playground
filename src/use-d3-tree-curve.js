import React from 'react';
import { line, CurveFactory } from 'd3-shape';

/**
 *
 * @typedef D3Link
 * @type {Object}
 * @property {HierarchyNode} source
 * @property {HierarchyNode} target
 *
 *
 * @typedef D3TreeCurveProps
 * @type {Object}
 * @property {CurveFactory} curve
 * @property {number} nodeWidth
 * @property {number} nodeHeight
 * @property {number} nodeMarginY
 * @property {Array<D3Link>} links
 *
 *
 * @typedef D3TreeCurveHookOptions
 * @type {Object}
 * @property {Array<string>} linksPathCache
 *
 *
 * @param {CurveFactory} curve
 * @returns {D3TreeCurveHookOptions}
 */
export function useD3TreeCurve({
  curve,
  links,
  nodeWidth,
  nodeHeight,
  nodeMarginY
}) {
  let [linksPathCache, cacheLinkPaths] = React.useState([]);

  React.useEffect(() => {
    let computeLinkAngle = line()
      .x((node) => node.x)
      .y((node) => node.y)
      .curve(curve);

    function renderLinkAngle(node) {
      let points = [
        {
          x: node.source.x + nodeWidth / 2,
          y: node.source.y + nodeHeight
        },
        {
          x: node.source.x + nodeWidth / 2,
          y: node.target.y - nodeMarginY / 2
        },
        {
          x: node.target.x + nodeWidth / 2,
          y: node.target.y - nodeMarginY / 2
        },
        {
          x: node.target.x + nodeWidth / 2,
          y: node.target.y
        }
      ];

      return computeLinkAngle(points);
    }

    cacheLinkPaths(links.map(renderLinkAngle));
  }, [curve, links, nodeHeight, nodeWidth, nodeMarginY]);

  return { linksPathCache };
}
