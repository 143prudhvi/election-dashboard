import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { geoMercator, geoPath, select, scaleLinear, min, max } from 'd3';
import { feature } from 'topojson-client';

const AndhraEducation = () => {
    const [geoData, setGeoData] = useState(null);
    const [schoolData, setSchoolData] = useState(null);
    const tooltipRef = useRef(null);
    const rootRef = useRef(null);

    useEffect(() => {
        // Fetch Andhra Pradesh Geo Data
        fetch('/json/Andhra Pradesh.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Andhra Pradesh data');
                }
                return response.json();
            })
            .then(data => setGeoData(data))
            .catch(error => console.error('Error fetching geoData:', error));

        // Fetch Schools Data
        fetch('/json/Schools.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Schools data');
                }
                return response.json();
            })
            .then(data => setSchoolData(data))
            .catch(error => console.error('Error fetching schoolData:', error));
    }, []);

    const capitalize = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const getDistrictColor = (d) => {
        const district = d.properties['District'];
        if (["Srikakulam", "Alluri Sitharama Raju", "West Godavari", "NTR", "Prakasam", "Ananthapuramu", "Chittoor"].includes(district)) {
            return "#fdcd8b";
        } else if (["Anakapalli", "East Godavari", "Guntur", "SPSR Nellore", "Kurnool", "Sri Satya Sai"].includes(district)) {
            return "#e44930";
        } else if (["Parvathipuram Manyam", "Visakhapatnam", "Kakinada", "Krishna", "Palnadu", "YSR Kadapa", "Tirupati"].includes(district)) {
            return "#fef0da";
        } else {
            return "#C6C680";
        }
    };

    const getTooltipContent = (d) => {
        const hoveredDistrictData = schoolData?.filter(school => 
            capitalize(d.properties['ac_name']) === capitalize(school['Assembly Constituency'])
        ) || [];

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
                                        src={`/${school.Gender === 'Boys' ? 'boys.jpg' : 'girls.jpg'}`}
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
        if (!geoData || !schoolData) return;

        const svg = select("svg");
        const g = svg.select("g");
        const projection = geoMercator().center([82, 16.5]).scale(5000);
        const geoPathGenerator = geoPath().projection(projection);

        const districts = feature(geoData, geoData.objects['Andhra Pradesh']).features;

        if (!rootRef.current) {
            rootRef.current = createRoot(tooltipRef.current);
        }

        g.selectAll("path")
            .data(districts)
            .enter()
            .append("path")
            .attr("d", geoPathGenerator)
            .attr("class", "feature")
            .attr("fill", getDistrictColor)
            .on("mousemove", function (event, d) {
                rootRef.current.render(getTooltipContent(d));

                select(".tooltip")
                    .style("opacity", 1)
                    .style("left", `${event.pageX - 100}px`)
                    .style("top", `${event.pageY + 24}px`);
            })
            .on("mouseout", function () {
                select(".tooltip").style("opacity", 0);
            });

        const areaScale = scaleLinear()
            .domain([
                min(districts, d => geoPathGenerator.area(d)),
                max(districts, d => geoPathGenerator.area(d))
            ])
            .range([1, 8]);

        g.selectAll("text")
            .data(districts)
            .enter()
            .append("text")
            .attr("x", d => geoPathGenerator.centroid(d)[0])
            .attr("y", d => geoPathGenerator.centroid(d)[1])
            .attr("text-anchor", "middle")
            .attr("font-size", d => areaScale(geoPathGenerator.area(d)))
            .attr("fill", "black")
            .text(d => capitalize(d.properties['ac_name']));

        const sizeScale = scaleLinear()
            .domain([
                min(schoolData, s => s.Students || 1),
                max(schoolData, s => s.Students || 100)
            ])
            .range([4, 16]);

        g.selectAll("image")
            .data(schoolData)
            .enter()
            .append("image")
            .attr("x", d => projection([+d.Lognitude, +d.Latitude])[0])
            .attr("y", d => projection([+d.Lognitude, +d.Latitude])[1])
            .attr("width", d => sizeScale(d.Students || 1))
            .attr("height", d => sizeScale(d.Students || 1))
            .attr("xlink:href", d => d.Gender === "Boys" ? "/boys.jpg" : "/girls.jpg")
            .attr("class", "school-icon");
    }, [geoData, schoolData]);

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
