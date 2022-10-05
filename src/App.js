import React,{ useEffect, useRef } from 'react';
import './App.css';
import {geoMercator, geoPath, select} from 'd3';
import {feature} from 'topojson-client';
import useResizeObserver from './useResizeObserver';
import data from './Himachal Pradesh.json';

function App() {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const width = window.innerWidth;
  const height = window.innerHeight;
  useEffect(() => {
    const svg = select(svgRef.current);
    // const {width,height} = dimensions || wrapperRef.current.getBoundingClientRect();
    
    const assemblies = feature(data,data.objects['Himachal Pradesh'])

    const projection = geoMercator().fitSize([width-50, height-50],assemblies);
    const pathGenerator = geoPath().projection(projection);

    svg.selectAll('.assembly')
      .data(assemblies.features)
      .join('path')
      .attr('class','assembly')
      .attr('stroke', "white")
      .attr('stroke-width' , '0.5px')
      .attr('fill','#0066A4')
      .attr('d', assembly => pathGenerator(assembly));
  },[])
  return (
    <div ref={wrapperRef}>
      <svg width={width-16} height={height-16} ref={svgRef}></svg>
    </div>
  );
}

export default App;
