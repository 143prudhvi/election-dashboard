import React,{ useEffect, useRef, useState } from 'react';
import {geoMercator, geoPath, select} from 'd3';
import {feature} from 'topojson-client';
import useResizeObserver from './useResizeObserver';
import data from './Himachal Pradesh.json';

const HimachalAssemblyMap = () => {
    const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const width = window.innerWidth;
  const height = window.innerHeight;
  var assemblies = feature(data,data.objects['Himachal Pradesh']);
  console.log(assemblies)
  useEffect(() => {
    const svg = select(svgRef.current);
    // const {width,height} = dimensions || wrapperRef.current.getBoundingClientRect();
    const center =  [77,32.3]
    const projection = geoMercator().center(center).scale(10000).precision(100);
    const pathGenerator = geoPath().projection(projection);

    svg.selectAll('.assembly')
      .data(assemblies.features)
      .join('path')
      .on("click", (event, assembly) => {
        setSelectedAssembly( selectedAssembly && selectedAssembly.properties ?  (selectedAssembly.properties.ac_no === assembly.properties.ac_no) ? null : assembly : assembly);
      })
      .attr('opacity', assembly => 
        selectedAssembly && selectedAssembly.properties ?  (selectedAssembly.properties.ac_no === assembly.properties.ac_no) ? 1 : 0.5 : 1
      )
      .attr('class','assembly')
      .transition()
      .attr('stroke', "white")
      .attr('stroke-width' , '0.5px')
      .attr('fill','#0066A4')
      .attr('d', assembly => pathGenerator(assembly));
  },[selectedAssembly,assemblies])
  return (
    <div ref={wrapperRef}>
      <svg width={width-400} height={height-50} ref={svgRef}></svg>
      
    </div>
    
  );
}

export default HimachalAssemblyMap;