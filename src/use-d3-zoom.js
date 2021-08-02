import React from 'react';
import { select } from 'd3-selection';
import { zoom, ZoomTransform } from 'd3-zoom';

/**
 *
 * @typedef D3ZoomProps
 * @type {Object}
 * @property {Array<Array<number>} extent
 * @property {Array<number>} scaleExtent
 *
 *
 * @typedef D3ZoomHookOptions
 * @type {Object}
 * @property {ZoomTransform} transformCache
 * @property {React.RefObject<SVGElement>} elementRef
 *
 *
 * @param {D3ZoomProps}
 * @returns {D3ZoomHookOptions}
 */
export function useD3Zoom({ extent, scaleExtent }) {
  let elementRef = React.useRef();
  let [transformCache, cacheTransform] = React.useState();

  React.useEffect(() => {
    select(elementRef.current).call(
      zoom()
        .extent(extent)
        .scaleExtent(scaleExtent)
        .on('zoom', ({ transform }) => cacheTransform(transform))
    );
  }, [extent, scaleExtent]);

  return { transformCache, elementRef };
}
