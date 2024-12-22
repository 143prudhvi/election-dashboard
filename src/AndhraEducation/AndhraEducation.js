import React,{ useEffect, useRef, useState } from 'react';
import {geoMercator, geoPath, select} from 'd3';
import {feature} from 'topojson-client';
import geoData from './AndhraPradeshDistricts.json';
import schoolsData from './Schools.json';
import ReactDOM from 'react-dom';

const AndhraEducation = () => {
    const [schoolData, setSchoolData] = useState(schoolsData);
    

    const canvas = useRef();
    var states = feature(geoData,geoData.objects['Districts']);

    function getDistrictColor(d){
        if(d.properties['District'] == "Srikakulam" || d.properties['District'] == "Alluri Sitharama Raju" 
            || d.properties['District'] == "West Godavari" || d.properties['District'] == "NTR" || 
            d.properties['District'] == "Prakasam" || d.properties['District'] == "Ananthapuramu" ||
            d.properties['District'] == "Chittoor"){
            return "#fdcd8b"
        }
        else if(d.properties['District'] == "Anakapalli" || d.properties['District'] == "East Godavari" 
            || d.properties['District'] == "Guntur" || d.properties['District'] == "SPSR Nellore" || 
            d.properties['District'] == "Kurnool" || d.properties['District'] == "Sri Satya Sai"){
            return "#e44930"
        }
        else if(d.properties['District'] == "Parvathipuram Manyam" || d.properties['District'] == "Visakhapatnam" || d.properties['District'] == "Kakinada" 
            || d.properties['District'] == "Krishna" || d.properties['District'] == "Palnadu" || 
            d.properties['District'] == "YSR Kadapa" || d.properties['District'] == "Tirupati"){
            return "#fef0da"
        }
        else{
            return "#fc8e58"
        }
    }

    function toCapitalize(str) {
        if (!str || typeof str !== 'string') return str; // Ensure input is valid
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function getStateWisePartySeatsHTML2019(d) {
        const hoveredDistrictData = schoolData.filter(
            (school) =>
                toCapitalize(d.properties['District']) === toCapitalize(school.District)
        );
    
        return (
            <div>
                <div className="title">{capitalize(d.properties['District'])}</div>
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
    }    

    function capitalize(str){
        const arr = str.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
        }
        const str2 = arr.join(" ");
        return str2
    }

    useEffect(() => {
        var svg = select("svg");

        var svgWidth = +svg.attr("viewBox").split(" ")[2],
        svgHeight = +svg.attr("viewBox").split(" ")[3];


        var g = svg.select("g");
        var g_pc = svg.select(".pc")


        var projection = geoMercator().center([82 ,16.5]).scale(5000);
        var geoPathGenerator = geoPath().projection(projection)

        var transitionDuration = 1250,
        featureStrokeWidth = 0.75,
        featureStroke = "#fff",
        featureFill = "#a6bddb",
        // during transition:
        //  - swap stroke and fill colors
        //  - change stroke width
        broughtUpFeatureStrokeWidth = 3,
        broughtUpFeatureStroke = "#a6bddb",
        broughtUpFeatureFill = "#fff";
      
        var div = select(".tooltip").style("opacity", 0)
        g
        .selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", geoPathGenerator)
        .attr("class", "feature")
        .attr("fill", getDistrictColor)
        .on("mousemove", function (event, d) {
            const tooltipContent = getStateWisePartySeatsHTML2019(d);
        
            ReactDOM.render(tooltipContent, document.querySelector(".tooltip"));
        
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
            
    },[schoolData])
    return (
        <>
            {/* <select onChange={(event) => changeYear(event)}>
                <option value={2019}>2019</option>
                <option value={2014}>2014</option>
            </select> */}
            <div className='tooltip'></div>
            <svg viewBox="0 0 840 700">
                <rect width="100%" height="100%" className="background"></rect>
                <g></g>
            </svg>
        </>
        
    );
}

export default AndhraEducation;