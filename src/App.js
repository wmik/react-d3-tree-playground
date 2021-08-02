import React from 'react';
import data from './data';
import { Chart } from './Chart';

export default function App() {
  let [dataCache, cacheData] = React.useState(data);

  return (
    <>
      <Chart
        data={dataCache}
        nodeWidth={400}
        nodeHeight={400}
        nodeMarginX={60}
        nodeMarginY={60}
        viewBox="-400, -100, 1080, 960"
        expandDepth={1}
      />
      <button
        onClick={() =>
          cacheData(() => ({
            ...data,
            children: data.children.slice(
              Math.floor(Math.random() * data.children.length)
            )
          }))
        }
      >
        refresh
      </button>
    </>
  );
}
