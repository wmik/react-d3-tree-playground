import React from 'react';
import { drag, D3DragEvent } from 'd3-drag';
import { select } from 'd3-selection';

/**
 *
 * @callback D3DragHandler
 * @param {D3DragEvent}
 * @returns {void}
 *
 * @typedef D3DragProps
 * @type {Object}
 * @property {D3DragHandler} onDrag
 * @property {D3DragHandler} onDragStart
 * @property {D3DragHandler} onDragEnd
 *
 *
 * @param {D3DragProps}
 * @returns {React.RefObject<SVGElement>}
 */
export function useD3Drag({ onDrag, onDragStart, onDragEnd }) {
  let elementRef = React.useRef();

  React.useEffect(() => {
    let handler = drag()
      .on('start', onDragStart)
      .on('drag', onDrag)
      .on('end', onDragEnd);

    select(elementRef.current).call(handler);
  }, [onDrag, onDragStart, onDragEnd]);

  return elementRef;
}
