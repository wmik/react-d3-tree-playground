import React from 'react';

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
 * @property {number} nodeWidth
 * @property {number} nodeHeight
 * @property {number} nodeMarginY
 * @property {Array<D3Link>} links
 *
 *
 * @typedef D3TreeCurveHookOptions
 * @type {Object}
 * @property {Array<string>} pointsCache
 *
 *
 * @param {D3TreeCurveProps}
 * @returns {D3TreeCurveHookOptions}
 */
export function useD3TreeCurve({ links, nodeWidth, nodeHeight, nodeMarginY }) {
  let [pointsCache, cachePoints] = React.useState([]);

  React.useEffect(() => {
    function computePoints(node) {
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

      return points;
    }

    cachePoints(links.map(computePoints));
  }, [links, nodeHeight, nodeWidth, nodeMarginY]);

  return { pointsCache };
}
