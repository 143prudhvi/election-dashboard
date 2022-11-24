import React,{ useEffect, useRef, useState } from 'react';
import {geoMercator, geoPath, select} from 'd3';
import {feature} from 'topojson-client';
import geoData from './India.json';
import pcData from './india_pc_2019.json';
import electionData2019 from './India-2019.json'
import partyNamesData from './PartyNames.json' 



const IndiaMap = () => {
    const canvas = useRef();
    var states = feature(geoData,geoData.objects['India']);
    var parliments = feature(pcData,pcData.objects['india_pc_2019'])
    var partyNames = {}
    partyNamesData.forEach(party => {
        partyNames[party['PARTY NAME']] = party['ABBREVIATION']
    })
    function color(party){
        if(party === "Aam Aadmi Party"){
            return "#0066A4";
        }else if(party === "Indian National Congress"){
            return "#19AAED";
        }else if(party === "Bharatiya Janata Party"){
            return "#FF9933";
        }else if(party === "Shiromani Akali Dal"){
            return "#ebc634";
        }else if(party === "Bahujan Samaj Party"){
            return "#22409A";
        }else if(party === "Samajwadi Party"){
            return "red";
        }else if(party === "Apna Dal (Soneylal)"){
            return "#9500ff"
        }else if(party === "Rashtriya Lok Dal"){
            return "green"
        }
        else if(party === "Rashtriya Janata Dal"){
            return "#008000"
        }
        else if(party == "Suheldev Bharatiya Samaj Party"){
            return "#ffd500"
        }else if(party == "Nirbal Indian Shoshit Hamara Aam Dal"){
            return "#823426"
        }else if(party == "Jansatta Dal Loktantrik"){
            return "#eaff00"
        }
        else if(party == "Telugu Desam"){
            return "#FFFF00"
        }
        else if(party == "Yuvajana Sramika Rythu Congress Party"){
            return "blue"
        }
        else if(party == "Janasena Party"){
            return "red"
        }
        else if(party == "Janata Dal  (Secular)"){
            return "#138808"
        }
        else if(party == "Janata Dal (United)" || party == "Janata Dal  (United)"){
            return "#003366"
        }
        else if(party == "Biju Janata Dal"){
            return '#006400'
        }
        else if(party == "Communist Party of India  (Marxist)" || party == "Communist Party of India (Marxist-Leninist) Red Star"){
            return '#FF1D15'
        }
        else if(party == "Communist Party of India"){
            return '#FF0000'
        }
        else if(party == "Communist Party of India  (Marxist-Leninist)  (Liberation)"){
            return '#FF1D15'
        }
        else if(party == "All India Trinamool Congress"){
            return '#20C646'
        }
        else if(party == "All India United Democratic Front"){
            return '#348017'
        }
        else if(party == "Bodoland Peoples Front"){
            return '#FF6600'
        }
        else if(party == "United People’s Party, Liberal"){
            return '#F3ED13'
        }
        else if(party == "Asom Gana Parishad"){
            return '#99CCFF'
        }
        else if(party == "All India Majlis-E-Ittehadul Muslimeen"){
            return '#136B4B'
        }
        else if(party == "Vikassheel Insaan Party"){
            return '#0000ff'
        }
        else if(party == "Hindustani Awam Morcha (Secular)"){
            return '#C9120C'
        }
        else if(party == "Lok Jan Shakti Party"){
            return '#0093DD'
        }
        else if(party == "Jannayak Janta Party"){
            return '#FFFF00'
        }
        else if(party == "Jharkhand Mukti Morcha"){
            return '#215B30'
        }
        else if(party == "Jharkhand Vikas Morcha (Prajatantrik)"){
            return '#EDFB06'
        }
        else if(party == "AJSU Party"){
            return '#FF33FF'
        }
        else if(party == "Nationalist Congress Party"){
            return '#00B2B2'
        }
        else if(party == "Shiv Sena" || party ==  "Shivsena"){
            return '#F26F21'
        }
        else if(party == "Telangana Rashtra Samithi"){
            return '#FF0274'
        }
        else if(party == "Janta Congress Chhattisgarh (J)"){
            return '#FFC0DB'
        }
        else if(party == "Indian National Lok Dal"){
            return '#336600'
        }
        else if(party == "Indian Union Muslim League" || party == "Muslim League Kerala State Committee"){
            return '#228B22'
        }
        else if(party == "Kerala Congress  (M)"){
            return '#CC9900'
        }
        else if(party == "Naga Peoples Front"){
            return '#990066'
        }
        else if(party == "National People's Party"){
            return '#DB7093'
        }
        else if(party == "Kuki People’s Alliance"){
            return '#FF0000'
        }
        else if(party == "Manipur State Congress Party"){
            return '#99CC99'
        }
        else if(party == "United Democratic Party"){
            return '#CEF2E0'
        }
        else if(party == "People's Democratic Front"){
            return 'yellow'
        }
        else if(party == "Hill State People’s Democratic Party"){
            return 'blue'
        }
        else if(party == "Mizo National Front"){
            return '#2E5694'
        }
        else if(party == "Nationalist Democratic Progressive Party"){
            return '#ED1B24'
        }
        else if(party == "Rashtriya Loktantrik Party"){
            return '#dbe934'
        }
        else if(party == "Dravida Munnetra Kazhagam"){
            return '#dd1100'
        }
        else if(party == "All India Anna Dravida Munnetra Kazhagam"){
            return '#138808'
        }
        else if(party == "Desiya Murpokku Dravida Kazhagam"){
            return '#ffea19'
        }
        else if(party == "Indigenousn People's Front Of Tripura"){
            return '#008000'
        }
        else if(party == "Revolutionary Socialist Party"){
            return '#FF4A4A'
        }
        else if(party == "All India Forward Bloc"){
            return '#D70000'
        }
        else if(party == "Gorkha Janmukti Morcha"){
            return '#52D017'
        }
        
        else if(party == "Jammu & Kashmir National Conference"){
            return '#fe0000'
        }
    
        else{
            return "#bdbdbd";
        }
    }

    var partiesSeats = []
    var totalVotes = 0;

    var statesData = []
    var stateSeats = []
    var totalStateSeats = 0
    var totalStateVotes = 0
    var candidates;
    Object.keys(electionData2019).forEach(state => {
        electionData2019[state].forEach(pc => {
            totalStateSeats += 1
            candidates = sortCandidates(pc.candidates)
            addWinner(candidates[0]);
            for(var j=1; j< candidates.length;j++){
                addCandidate(candidates[j])
            }
        })
        for(var k=0; k<stateSeats.length;k++){
            stateSeats[k].VotePercent = (stateSeats[k].Votes/ totalStateVotes * 100).toFixed(2)
        }
        stateSeats = sortPartiesbySeats(sortPartiesbyVotes(stateSeats))
        statesData.push({
            "State" : state,
            "Seats" : totalStateSeats,
            "Parties" : stateSeats
        })
        totalVotes += totalStateVotes
        stateSeats.forEach(party => {
            addParty(party)
        })
        stateSeats = []
        totalStateSeats = 0
        totalStateVotes = 0
    });

    console.log(partiesSeats)
    console.log(statesData)

    partiesSeats = sortPartiesbySeats(sortPartiesbyVotes(partiesSeats))
    
    function addParty(party){
        for(var j=0; j<=partiesSeats.length; j++){
            if(partiesSeats[j] && partiesSeats[j].Party === party.Party){
                partiesSeats[j].Seats += party['Seats']
                partiesSeats[j].Votes += party['Votes']
                return 
            }
        }
        partiesSeats.push({
            Party : party.Party,
            Seats : party.Seats,
            Votes : party['Votes']
        })
    }

    function addWinner(winner){
        totalStateVotes += Number(winner['Total Votes']);
        for(var j=0; j<=stateSeats.length; j++){
            if(stateSeats[j] && stateSeats[j].Party === winner.Party){
                stateSeats[j].Seats += 1
                stateSeats[j].Votes += Number(winner['Total Votes'])
                return 
            }
        }
        stateSeats.push({
            Party : winner.Party,
            Seats : 1,
            Votes : Number(winner['Total Votes'])
        })
        return
    }
    function addCandidate(candidate){
        totalStateVotes += Number(candidate['Total Votes']);
        for(var j=0; j<=stateSeats.length; j++){
            if(stateSeats[j] && stateSeats[j].Party === candidate.Party){
                stateSeats[j].Votes += Number(candidate['Total Votes'])
                return 
            }
        }
        stateSeats.push({
            Party : candidate.Party,
            Seats : 0,
            Votes : Number(candidate['Total Votes'])
        })
        return
    }

    function sortCandidates(candidates){
        candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
        return candidates
    }

    function sortPartiesbySeats(parties){
        parties.sort((a,b) => {return b['Seats'] - a['Seats']})
        return parties
    }

    function sortPartiesbyVotes(parties){
        parties.sort((a,b) => {return b['Votes'] - a['Votes']})
        return parties
    }
    

    function getWinnerPartyColor2019(d){
        var candidates;
        var pc_data = electionData2019[d.properties['ST_NAME']]
        for(var i = 0; i<pc_data.length; i++){
            if(pc_data[i]['pc_no'] == d.properties.PC_CODE){
                candidates = pc_data[i]['candidates']
                candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
                return color(candidates[0]['Party'])
            }
        }
    }
  
    function getStateWinnerPartyColor2019(d){
        var currentStateData;
        for(var i = 0 ; i<statesData.length; i++){
            if(d.properties['ST_NAME'] === statesData[i].State){
                currentStateData = statesData[i]
            }
        }

        return color(currentStateData.Parties[0].Party)
    }

    function getStateWisePartySeatsHTML2019(d){
        var hoveredStateData;
        for(var i = 0 ; i<statesData.length; i++){
            if(d.properties['ST_NAME'] === statesData[i].State){
                hoveredStateData = statesData[i]
            }
        }
        var hoveredStateParties = hoveredStateData.Parties
        var code = "";
        code += "<div class='title'>" + capitalize(hoveredStateData.State) + "</div><div class='subtitle'>Seats : <b>" + hoveredStateData.Seats + "</b></div>";
        code += "<table><tbody>"
        for(var i = 0; i< hoveredStateParties.length; i++){
            if(hoveredStateParties[i].Seats === 0 && Number(hoveredStateParties[i].VotePercent) < 2){
                code += "</tbody></table>"
                return code
            }
            code += "<tr><td style='background-color:" + color(hoveredStateParties[i].Party) + "'>" + partyNames[hoveredStateParties[i].Party] + "</td><td>" + hoveredStateParties[i].Seats + "</td><td>" + hoveredStateParties[i].Votes.toLocaleString("en-IN") + "</td><td>" + hoveredStateParties[i].VotePercent + "</td>";
        }
        code += "</tbody></table>"
        return code
    }

    function getPCData(d){
        var clickedStateData = electionData2019[d.properties['ST_NAME']];
        var hoveredPCData;
        for(var i = 0 ; i<clickedStateData.length; i++){
            if(d.properties['PC_CODE'] === clickedStateData[i].pc_no){
                hoveredPCData = clickedStateData[i]
            }
        }
        var hoveredPCCandidates = hoveredPCData.candidates
        var code = "";
        code += "<div class='title'>" + capitalize(hoveredPCData.pc_name) + "</div>";
        code += "<table><tbody>"
        for(var i = 0; i< hoveredPCCandidates.length; i++){
            if(hoveredPCCandidates[i]['Vote %'] < 2){
                code += "</tbody></table>"
                return code
            }
            code += "<tr><td style='background-color:" + color(hoveredPCCandidates[i].Party) + "'>" + partyNames[hoveredPCCandidates[i].Party] + "</td><td class='candidate-name'>" + hoveredPCCandidates[i]['Candidate'].split(' ').join('_') + "</td><td>" + hoveredPCCandidates[i]['Total Votes'].toLocaleString("en-IN") + "</td><td>" + hoveredPCCandidates[i]['Vote %'].toFixed(2) + "</td>";
        }
        code += "</tbody></table>"
        return code
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


        var projection = geoMercator().center([85,27]).scale(1000);
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
      
        var rect = svg.select("rect.background").on("click", reset);
        var div = select(".tooltip").style("opacity", 0)
        var div_pc = select(".tooltip_pc").style("opacity", 0);
        g
        .selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", geoPathGenerator)
        .attr("class", "feature")
        .attr("fill", getStateWinnerPartyColor2019)
        .on("click", bringUpFeature)
        .on("mousemove", function(event,d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", 1);		
            div.html(() => getStateWisePartySeatsHTML2019(d))	
                .style("left", (event.pageX - 100) + "px")		
                .style("top", (event.pageY + 24) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

        
            
        function bringUpFeature(geoJsonDatum) {
        
            var statesPCs = parliments.features.filter((item) => item.properties.ST_CODE == geoJsonDatum.target.__data__.properties.ST_CODE)
            
            var t = getGeoBoundsTransform(
            geoJsonDatum,
            geoPathGenerator,
            svgWidth,
            svgHeight
            );

            
        
            var pc_g = g_pc
            .selectAll("path")
            .data(statesPCs)
            .enter()
            .append("path")
            .attr("d", geoPathGenerator)
            .attr("class", "pc")
            .attr("fill" , getWinnerPartyColor2019)
            .style("stroke-width", "0.2px")
            .style("stroke" , "white")
            

            pc_g
            .transition()
            .duration(transitionDuration)
            .attr("transform", "translate(" + t.translate + ") scale(" + t.scale + ")")


            pc_g
            .on("mousemove", function(event,d) {		
                div_pc.transition()		
                    .duration(200)		
                    .style("opacity", 1);		
                div_pc.html(() => getPCData(d))	
                    .style("left", (event.pageX - 160) + "px")		
                    .style("top", (event.pageY + 24) + "px");	
                })					
            .on("mouseout", function(d) {		
                div_pc.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });

        
            var otherFeatures = g.selectAll("path.feature");
        
            // remove the original click listener before transitioning the other features out of view
            otherFeatures.on("click", null);
        
            otherFeatures
            .transition()
            .duration(transitionDuration)
            .style("opacity", "0")
            .on("end", function(d, idx, nodeList) {
                // completely remove the display of the other features after transition is over
                if (idx === nodeList.length - 1) {
                otherFeatures.style("display", "none");
                }
            });
        }
      
        function reset() {
            g_pc.selectAll('path')
            .transition()
            .duration(transitionDuration)
            .attr('transform', "")
            .remove();
        
            var otherFeatures = g.selectAll("path.feature");
        
            // reset display of other features before transitioning back into view
            otherFeatures.style("display", "");
        
            otherFeatures
            .transition()
            .duration(transitionDuration)
            .style("opacity", "1")
            .on("end", function(d, idx, nodeList) {
                // reestablish the original click listener after transition is over
                if (idx === nodeList.length - 1) {
                otherFeatures.on("click", bringUpFeature);
                }
            });
        
        }
            
        function getGeoBoundsTransform(geoJsonDatum, geoPathGenerator, width, height) {
            var bounds = geoPathGenerator.bounds(geoJsonDatum.target.__data__)
            var dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = 0.9 / Math.max(dx / width, dy / height),
            translate = [width / 2 - scale * x, height / 2 - scale * y];
        
            return {
            translate: translate,
            scale: scale
            };
        }
    },[states.features,electionData2019])
    return (
        <>
            <div className='tooltip'></div>
            <div className='tooltip_pc'></div>
            <svg viewBox="0 0 840 700">
                <rect width="100%" height="100%" className="background"></rect>
                <g></g>
                <g className="pc"></g>
            </svg>
        </>
        
    );
}

export default IndiaMap;