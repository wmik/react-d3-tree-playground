import React from 'react';
import { hierarchy, tree, HierarchyNode } from 'd3-hierarchy';

/**
 * @typedef TreeData
 * @type {Object}
 * @property {?Array} children
 *
 * @typedef D3Link
 * @type {Object}
 * @property {HierarchyNode} source
 * @property {HierarchyNode} target
 *
 * @typedef D3TreeProps
 * @type {Object}
 * @property {TreeData} data
 * @property {number} nodeWidth
 * @property {number} nodeHeight
 * @property {number} nodeMarginX
 * @property {number} nodeMarginY
 * @property {number} expandDepth
 *
 *
 * @typedef D3TreeHookOptions
 * @type {Object}
 * @property {Array<D3Link>} linksCache
 * @property {Array<HierarchyNode>} nodesCache
 *
 *
 * @param {D3TreeProps}
 * @returns {D3TreeHookOptions}
 */
export function useD3Tree({
  data,
  nodeWidth = 100,
  nodeHeight = 100,
  nodeMarginX = 10,
  nodeMarginY = 10,
  expandDepth = 1
}) {
  let [nodesCache, cacheNodes] = React.useState([]);
  let [linksCache, cacheLinks] = React.useState([]);

  React.useEffect(() => {
    let computeLayout = tree().nodeSize([
      nodeWidth + nodeMarginX,
      nodeHeight + nodeMarginY
    ]);

    let root = hierarchy(data);

    root.descendants().forEach((node, i) => {
      node.id = node.id ?? i;
      node._children = node.children;

      if (node.depth > expandDepth - 1) {
        node.children = null;
      }
    });

    computeLayout(root);
    cacheNodes(root.descendants().reverse());
    cacheLinks(root.links());
  }, [data, nodeWidth, nodeHeight, nodeMarginX, nodeMarginY, expandDepth]);

  function computeLayout(root) {
    let layout = tree().nodeSize([
      nodeWidth + nodeMarginX,
      nodeHeight + nodeMarginY
    ]);
    return layout(root);
  }

  return { linksCache, nodesCache, computeLayout, cacheNodes, cacheLinks };
}
