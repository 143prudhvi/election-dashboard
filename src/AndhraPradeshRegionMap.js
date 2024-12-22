import React,{ useEffect, useRef, useState } from 'react';
import {geoMercator, geoPath, select} from 'd3';
import {feature} from 'topojson-client';
import useResizeObserver from './useResizeObserver';
import geoData from './Andhra Pradesh.json';
import electionData2014 from './Andhra Pradesh-2024.json';
import electionData2019 from './Andhra Pradesh-2019.json';



const AndhraPradeshRegionMap = () => {
    const svgRef2014 = useRef();
    const svgRef2019 = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const width = window.innerWidth;
    const height = window.innerHeight;
    var assemblies = feature(geoData,geoData.objects['Andhra Pradesh']);
    var partiesData2014 = []
    var partiesData2019 = []
    var totalVotes2014 = 0
    var totalVotes2019 = 0
    var regionalConstituencies = []
    var TDP = {};
    var YCP = {};
    var JSP = {};
    var Others = {
        2019 : {
            Party : "Others",
            Seats : 0,
            Votes : 0,
            VotePercent : 0
        },
        2014 : {
            Party : "Others",
            Seats : 0,
            Votes : 0,
            VotePercent : 0
        }
        
    };

    function sortCandidates(candidates){
        candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
        return candidates
    }

    function sortParties(parties){
        parties.sort((a,b) => {return b['Seats'] - a['Seats']})
        return parties
    }

    function getWinnerPartyColor2014(d){
        var candidates;
        for(var i = 0; i<electionData2014.length; i++){
            if(electionData2014[i]['ac_no'] == d.properties.ac_no){
                candidates = electionData2014[i]['candidates']
                candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
                return color(candidates[0]['Party'])
            }
        }
    }

    function getWinnerPartyColor2019(d){
        var candidates;
        for(var i = 0; i<electionData2019.length; i++){
            if(electionData2019[i]['ac_no'] == d.properties.ac_no){
                candidates = electionData2019[i]['candidates']
                candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
                return color(candidates[0]['Party'])
            }
        }
    }

    function color(party){
        if(party === "Telugu Desam"){
            return "#ffff00";
        }else if(party === "Bharatiya Janata Party"){
            return "#FF9933";
        }else if(party === "Yuvajana Sramika Rythu Congress Party"){
            return "blue";
        }else if(party === "Janasena Party"){
            return "#FF0000";
        }else{
            return '#909090'
        }
    }

    function addWinner2014(winner){
        totalVotes2014 += Number(winner['Total Votes'])
        for(var j=0; j<=partiesData2014.length; j++){
            if(partiesData2014[j] && partiesData2014[j].Party === winner.Party){
                partiesData2014[j].Seats += 1
                partiesData2014[j].Votes += Number(winner['Total Votes'])
                return 
            }
        }
        partiesData2014.push({
            Party : winner.Party,
            Seats : 1,
            Votes : Number(winner['Total Votes'])
        })
        return
    }

    function addWinner2019(winner){
        totalVotes2019 += Number(winner['Total Votes'])
        for(var j=0; j<=partiesData2019.length; j++){
            if(partiesData2019[j] && partiesData2019[j].Party === winner.Party){
                partiesData2019[j].Seats += 1
                partiesData2019[j].Votes += Number(winner['Total Votes'])
                return 
            }
        }
        partiesData2019.push({
            Party : winner.Party,
            Seats : 1,
            Votes : Number(winner['Total Votes'])
        })
        return
    }

    function addCandidate2014(candidate){
        totalVotes2014 += Number(candidate['Total Votes']);
          for(var j=0; j<=partiesData2014.length; j++){
              if(partiesData2014[j] && partiesData2014[j].Party === candidate.Party){
                  partiesData2014[j].Votes += Number(candidate['Total Votes'])
                  return 
              }
          }
          partiesData2014.push({
              Party : candidate.Party,
              Seats : 0,
              Votes : Number(candidate['Total Votes'])
          })
          return
      }
    
    function addCandidate2019(candidate){
      totalVotes2019 += Number(candidate['Total Votes']);
        for(var j=0; j<=partiesData2019.length; j++){
            if(partiesData2019[j] && partiesData2019[j].Party === candidate.Party){
                partiesData2019[j].Votes += Number(candidate['Total Votes'])
                return 
            }
        }
        partiesData2019.push({
            Party : candidate.Party,
            Seats : 0,
            Votes : Number(candidate['Total Votes'])
        })
        return
    }
    
    if(selectedRegion){
        assemblies.features.map(assembly => {
            if(selectedRegion===assembly.properties.region){
                regionalConstituencies.push(Number(assembly.properties.ac_no))
            }
        })
        electionData2014.map(assembly => {
            if(regionalConstituencies.includes(Number(assembly.ac_no))){
                var candidates = sortCandidates(assembly.candidates);
                addWinner2014(candidates[0])
                for(var j=1; j< candidates.length;j++){
                    addCandidate2014(candidates[j])
                }
            }
            
        })
        electionData2019.map(assembly => {
            if(regionalConstituencies.includes(Number(assembly.ac_no))){
                var candidates = sortCandidates(assembly.candidates);
                addWinner2019(candidates[0])
                for(var j=1; j< candidates.length;j++){
                    addCandidate2019(candidates[j])
                }
            }
            
        })
    }else{
        electionData2014.map(assembly => {
            var candidates = sortCandidates(assembly.candidates);
            addWinner2014(candidates[0])
            for(var j=1; j< candidates.length;j++){
                addCandidate2014(candidates[j])
            }
        })
        electionData2019.map(assembly => {
            var candidates = sortCandidates(assembly.candidates);
            addWinner2019(candidates[0])
            for(var j=1; j< candidates.length;j++){
                addCandidate2019(candidates[j])
            }
        })
    }

    for(var k=0; k<partiesData2014.length;k++){
        partiesData2014[k].VotePercent = (partiesData2014[k].Votes/ (totalVotes2014 ? totalVotes2014 : 1) * 100).toFixed(2)
    }
    
    for(var k=0; k<partiesData2019.length;k++){
        partiesData2019[k].VotePercent = (partiesData2019[k].Votes/ (totalVotes2019 ? totalVotes2019 : 1) * 100).toFixed(2)
    }

    partiesData2014 = sortParties(partiesData2014)
    partiesData2019 = sortParties(partiesData2019)

    partiesData2014.forEach(party => {
        if(party.Party === "Telugu Desam"){
            TDP['2014'] = party
        }else if(party.Party === "Bharatiya Janata Party"){
            TDP['2014'].Seats += party.Seats
            TDP['2014'].Votes += party.Votes
            TDP['2014'].VotePercent = (Number(TDP['2014'].VotePercent) + Number(party.VotePercent)).toFixed(2);

        }else if(party.Party === "Janasena Party"){
            TDP['2014'].Seats += party.Seats
            TDP['2014'].Votes += party.Votes
            TDP['2014'].VotePercent = (Number(TDP['2014'].VotePercent) + Number(party.VotePercent)).toFixed(2);

        }else if(party.Party === "Yuvajana Sramika Rythu Congress Party"){
            YCP['2014'] = party
        }else{
            Others['2014'].Seats += party.Seats;
            Others['2014'].Votes += party.Votes;
            Others['2014'].VotePercent = (Number(Others['2014'].VotePercent) + Number(party.VotePercent)).toFixed(2);
        }
    })
    
    partiesData2019.forEach(party => {
        if(party.Party === "Telugu Desam"){
            TDP['2019'] = party
        }else if(party.Party === "Yuvajana Sramika Rythu Congress Party"){
            YCP['2019'] = party
        }else if(party.Party === "Janasena Party"){
            JSP['2019'] = party
        }else{
            Others['2019'].Seats += party.Seats;
            Others['2019'].Votes += party.Votes;
            Others['2019'].VotePercent = (Number(Others['2019'].VotePercent) + Number(party.VotePercent)).toFixed(2);
        }
    })

    useEffect(() => {
        const svg2014 = select(svgRef2014.current);
        const svg2019 = select(svgRef2019.current);
        // const {width,height} = dimensions || wrapperRef.current.getBoundingClientRect();
        const center =  [82, 16]
        
        const projection = geoMercator().center(center).scale(3500).precision(100);
        const pathGenerator = geoPath().projection(projection);

        svg2014.selectAll('.assembly')
        .data(assemblies.features)
        .join('path')
        .on("click", (event, assembly) => {
            setSelectedRegion( selectedRegion === assembly.properties.region ? null : assembly.properties.region);
        })
        .attr('opacity', assembly => 
            selectedRegion  ?  (selectedRegion === assembly.properties.region) ? 1 : 0.3 : 1
        )
        .attr('class','assembly')
        .transition()
        .attr('stroke', "black")
        .attr('stroke-width' , '0.5px')
        .attr('fill', getWinnerPartyColor2014)
        .attr('d', assembly => pathGenerator(assembly));

        svg2019.selectAll('.assembly')
        .data(assemblies.features)
        .join('path')
        .on("click", (event, assembly) => {
            setSelectedRegion( selectedRegion === assembly.properties.region ? null : assembly.properties.region);
        })
        .attr('opacity', assembly => 
            selectedRegion  ?  (selectedRegion === assembly.properties.region) ? 1 : 0.3 : 1
        )
        .attr('class','assembly')
        .transition()
        .attr('stroke', "black")
        .attr('stroke-width' , '0.5px')
        .attr('fill', getWinnerPartyColor2019)
        .attr('d', assembly => pathGenerator(assembly));
    },[selectedRegion,assemblies.features])
    return (
        <div>
            <div  className='wrapper1' ref={wrapperRef}>
                <svg className='svg-2014' width={width * 0.48} height={height-214} ref={svgRef2014}></svg>
                <div className='region-data'>
                    <div className='party TDP'>
                        <div className='party-title'>TDP+</div>
                        <div className='seats-won'>{TDP['2014'].Seats}</div>
                        <div className='vote-percent'>{TDP['2014'].VotePercent}</div>
                    </div>
                    <div className='party YCP'>
                        <div className='party-title'>YCP</div>
                        <div className='seats-won'>{YCP['2014'].Seats}</div>
                        <div className='vote-percent'>{YCP['2014'].VotePercent}</div>
                    </div>
                    <div className='party Others'>
                        <div className='party-title'>Others</div>
                        <div className='seats-won'>{Others['2014'].Seats}</div>
                        <div className='vote-percent'>{Others['2014'].VotePercent}</div>
                    </div>
                </div>
            </div>
            <div  className='wrapper2' ref={wrapperRef}>
                <svg className='svg-2019' width={width * 0.48} height={height-214} ref={svgRef2019}></svg>
                <div className='region-data'>
                    <div className='party TDP'>
                        <div className='party-title'>TDP</div>
                        <div className='seats-won'>{TDP['2019'].Seats}</div>
                        <div className='vote-percent'>{TDP['2019'].VotePercent}</div>
                    </div>
                    <div className='party YCP'>
                        <div className='party-title'>YCP</div>
                        <div className='seats-won'>{YCP['2019'].Seats}</div>
                        <div className='vote-percent'>{YCP['2019'].VotePercent}</div>
                    </div>
                    <div className='party JSP'>
                        <div className='party-title'>JSP</div>
                        <div className='seats-won'>{JSP['2019'].Seats}</div>
                        <div className='vote-percent'>{JSP['2019'].VotePercent}</div>
                    </div>
                    <div className='party Others'>
                        <div className='party-title'>Others</div>
                        <div className='seats-won'>{Others['2019'].Seats}</div>
                        <div className='vote-percent'>{Others['2019'].VotePercent}</div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default AndhraPradeshRegionMap;