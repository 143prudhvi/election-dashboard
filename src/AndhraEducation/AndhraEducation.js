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
        debugger;
        const district = d.properties['ac_name'];
        // if (["Srikakulam1", "Alluri Sitharama Raju", "West Godavari", "NTR", "Prakasam", "Ananthapuramu", "Chittoor"].includes(district)) {
        //     return "#fdcd8b";
        // } else if (["Anakapalli", "East Godavari", "Guntur", "SPSR Nellore", "Kurnool", "Sri Satya Sai"].includes(district)) {
        //     return "#e44930";
        // } else if (["Parvathipuram Manyam", "Visakhapatnam", "Kakinada", "Krishna", "Palnadu", "YSR Kadapa", "Tirupati"].includes(district)) {
        //     return "#fef0da";
        // } else 
        
        if (["Ichchapuram", "Kurupam (ST)", "Palasa", "Palakonda (ST)", "Pathapatnam", "Parvathipuram (SC)", "Salur (ST)",
                "Tekkali", "Narasannapeta", "Rajam (SC)", "Bobbili", "Narasapuram", "Amadalavalasa","Araku Valley (ST)",
                "Gajapathinagaram", "Etcherla","Srikakulam"
        ].includes(district)) {
            return "#f8f87d";
        }else  if (["Cheepurupalle", "Nellimarla","Srungavarapukota","Vizianagaram","Payakaraopet (SC)", "Paderu (ST)",
                    "Madugula", "Bhimili", "Chodavaram", "Rampachodavaram(ST)", "Pendurthi", "Anakapalle", "Visakhapatnam North",
                    "Narsipatnam", "Visakhapatnam East", "Visakhapatnam West"
        ].includes(district)) {
            return "#f6f467";
        } else  if (["Kuppam", "Chittoor","Palamaner","Gangadhara Nellore (SC)","Puthalapattu (SC)", "Nagari",
                    "Madanapalle", "Punganur", "Tirupati", "Satyavedu (SC)", "Chandragiri", "Srikalahasti", "Pileru",
                    "Hindupur", "Thamballapalle", "Madakasira (SC)"
        ].includes(district)) {
            return "#f4f259";
        } 
        else  if (["Gajuwaka","Visakhapatnam South","Yelamanchili","Tenali","Tuni","Guntur West","Polavaram (ST)",
                "Prathipadu","Tiruvuru (SC)","Jaggampeta","Rajanagaram","Pithapuram","Anaparthy","Rajahmundry City",
                "Chintalapudi (SC)","Gopalapuram (SC)","Peddapuram"
        ].includes(district)) {
            return "#f2f04c";
        } 
        else  if (["Penukonda","Rayachoti","Sullurpeta (SC)","Kadiri","Kodur (SC)","Puttaparthi","Rajampet",
                "Nellore City","Kadapa","Venkatagiri","Sarvepalli","Gudur (SC)","Kovur","Kamalapuram",
                "Dharmavaram","Kalyandurg","Nellore Rural"
        ].includes(district)) {
            return "#f0ed3f";
        } 
        else  if (["Pulivendla","Raptadu","Anantapur Urban","Atmakur","Kavali","Mydukur","Jammalamadugu",
                "Udayagiri","Singanamala (SC)","Rayadurg","Tadpatri","Uravakonda","Badvel (SC)","Guntakal",
                "Kandukur","Allagadda","Banaganapalle"
        ].includes(district)) {
            return "#e8e430";
        } 
        else  if (["Kanigiri","Nandyal","Ongole","Kondapi (SC)","Dhone","Pattikonda","Alur",
                "Santhanuthalapadu (SC)","Giddalur","Rayadurg","Adoni","Markapuram","Panyam","Kurnool",
                "Kodumur (SC)","Chirala","Yemmiganur"
        ].includes(district)) {
            return "#e4d625";
        } 
        else  if (["Darsi","Mantralayam","Bapatla","Parchur","Dhone","Repalle","Nandikotkur (SC)",
                "Proddatur","Addanki","Srisailam","Avanigadda","Vemuru (SC)","Machilipatnam","Chilakaluripet",
                "Prathipadu (SC)","Yerragondapalem (SC)","Narasaraopet"
        ].includes(district)) {
            return "#e0c71f";
        } 
        else  if (["Kovvur (SC)",
            "Nidadavole",
            "Nuzvid",
            "Kakinada Rural",
            "Jaggayyapeta",
            "Rajahmundry Rural",
            "Kothapeta",
            "Eluru",
            "Mummidivaram",
            "Mylavaram",
            "Mandapeta",
            "Tadepalligudem",
            "Kakinada City",
            "Denduluru",
            "Ungutur",
            "Nandigama (SC)",
            "Ramachandrapuram",
            "Pedakurapadu",
            "Tanuku",
            "Gurajala"
        ].includes(district)) {
            return "#f0d729";
        } 
        else  if ([
            "Gannavaram",
            "Gannavaram (SC)",
            "Kaikalur",
            "Achanta",
            "Undi",
            "Macherla",
            "Bhimavaram",
            "Amalapuram (SC)",
            "Tadikonda (SC)",
            "Palacole",
            "Vijayawada Central",
            "Gudivada",
            "Vijayawada West",
            "Razole (SC)",
            "Pamarru (SC)",
            "Penamaluru",
            "Vijayawada East",
            "Mangalagiri",
            "Sattenapalle",
            "Pedana",
            "Vinukonda",
            "Guntur East",
            "Ponnur"
        ].includes(district)) {
            return "#eecf1f";
        } 
        else {
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
                                        src={`/${school.Gender === 'Boys' ? 'boys.png' : 'girls.png'}`}
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
        debugger;
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
            .attr("stroke", "#00ff00") 
            .attr("stroke-width", 1)
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
            .attr("xlink:href", d => d.Gender === "Boys" ? "/boys.png" : "/girls.png")
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
