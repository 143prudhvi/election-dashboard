import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { geoMercator, geoPath, select, scaleLinear, min, max } from 'd3';
import { feature } from 'topojson-client';
import geoData from './Andhra Pradesh.json';
import schoolsData from './Schools.json';

const AndhraEducation = () => {
    const [schoolData, setSchoolData] = useState(schoolsData);
    const tooltipRef = useRef(null);
    const rootRef = useRef(null); // Store the root instance

    const districts = feature(geoData, geoData.objects['Andhra Pradesh']);

    const getDistrictColor = (d) => {
        if (
            ["Srikakulam", "Alluri Sitharama Raju", "West Godavari", "NTR", "Prakasam", "Ananthapuramu", "Chittoor"].includes(
                d.properties['District']
            )
        ) {
            return "#fdcd8b";
        } else if (
            ["Anakapalli", "East Godavari", "Guntur", "SPSR Nellore", "Kurnool", "Sri Satya Sai"].includes(
                d.properties['District']
            )
        ) {
            return "#e44930";
        } else if (
            ["Parvathipuram Manyam", "Visakhapatnam", "Kakinada", "Krishna", "Palnadu", "YSR Kadapa", "Tirupati"].includes(
                d.properties['District']
            )
        ) {
            return "#fef0da";
        } else {
            return "#fc8e58";
        }
    };

    const capitalize = (str) => {
        console.log(str)
        const arr = str.split(" ");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
        }
        return arr.join(" ");
    };

    const getStateWisePartySeatsHTML2019 = (d) => {
        const hoveredDistrictData = schoolData.filter(
            (school) =>
                capitalize(d.properties['ac_name']) === capitalize(school['Assembly Constituency'])
        );

        return (
            <div>
                <div className="title">{capitalize(d.properties['ac_name'])}</div>
                <div className="subtitle">
                    Schools: <b>{hoveredDistrictData.length}</b>
                </div>
                <table>
                    <tbody>
                        {hoveredDistrictData.map((school, index) => (
                            <tr key={index}>
                                <td>{capitalize(school['Name of the Institution'])}</td>
                                <td>
                                    <img
                                        src={`/${
                                            school.Gender === 'Boys' ? 'boys.jpg' : 'girls.jpg'
                                        }`}
                                        alt={school.Gender}
                                        width="16"
                                        height="16"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    useEffect(() => {
        const svg = select("svg");
        const g = svg.select("g");
        const projection = geoMercator().center([82, 16.5]).scale(5000);
        const geoPathGenerator = geoPath().projection(projection);

        const tooltipContainer = tooltipRef.current;

        // Initialize createRoot once
        if (!rootRef.current) {
            rootRef.current = createRoot(tooltipContainer);
        }

        g.selectAll("path")
            .data(districts.features)
            .enter()
            .append("path")
            .attr("d", geoPathGenerator)
            .attr("class", "feature")
            .attr("fill", getDistrictColor)
            .on("mousemove", function (event, d) {
                const tooltipContent = getStateWisePartySeatsHTML2019(d);

                // Reuse the existing root instance
                rootRef.current.render(tooltipContent);

                select(".tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("left", `${event.pageX - 100}px`)
                    .style("top", `${event.pageY + 24}px`);
            })
            .on("mouseout", function () {
                select(".tooltip")
                    .transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add district names
        g.selectAll("text")
            .data(districts.features)
            .enter()
            .append("text")
            .attr("x", d => geoPathGenerator.centroid(d)[0])
            .attr("y", d => geoPathGenerator.centroid(d)[1])
            .attr("text-anchor", "middle")
            .attr("font-size", d => {
                const area = geoPathGenerator.area(d);
                const fontSizeScale = scaleLinear()
                    .domain([min(districts.features, d => geoPathGenerator.area(d)), max(districts.features, d => geoPathGenerator.area(d))])
                    .range([1, 8]);
                return fontSizeScale(area);
            })
            .attr("fill", "black")
            .text(d => capitalize(d.properties["ac_name"]));

        // Add school icons
        g.selectAll("image")
        .data(schoolData)
        .enter()
        .append("image")
        .attr("x", d => {
            const coords = projection([+d.Lognitude, +d.Latitude]);
            return coords ? coords[0] : null;
        })
        .attr("y", d => {
            const coords = projection([+d.Lognitude, +d.Latitude]);
            return coords ? coords[1] : null;
        })
        .attr("width", d => {
            const sizeScale = scaleLinear()
                .domain([min(schoolData, s => s.Students || 1), max(schoolData, s => s.Students || 100)])
                .range([4, 8]); // Adjust icon size range
            return sizeScale(d.Students || 1);
        })
        .attr("height", d => {
            const sizeScale = scaleLinear()
                .domain([min(schoolData, s => s.Students || 1), max(schoolData, s => s.Students || 100)])
                .range([4, 8]); // Adjust icon size range
            return sizeScale(d.Students || 1);
        })
        .attr("xlink:href", d => d.Gender === "Boys" ? "/boys.jpg" : "/girls.jpg") // Path to the icon
        .attr("class", "school-icon");

    }, [schoolData]);

    return (
        <>
            <div className="tooltip" ref={tooltipRef}></div>
            <svg viewBox="0 0 840 700">
                <rect width="100%" height="100%" className="background"></rect>
                <g></g>
            </svg>
        </>
    );
};

export default AndhraEducation;
