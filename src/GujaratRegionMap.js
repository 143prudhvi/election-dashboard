import React,{ useEffect, useRef, useState } from 'react';
import {geoMercator, geoPath, select} from 'd3';
import {feature} from 'topojson-client';
import useResizeObserver from './useResizeObserver';
import geoData from './Gujarat.json';
import electionData2017 from './Gujarat-2017.json';
import electionData2012 from './Gujarat-2012.json';



const GujaratRegionMap = () => {
    const svgRef2012 = useRef();
    const svgRef2017 = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const width = window.innerWidth;
    const height = window.innerHeight;
    var assemblies = feature(geoData,geoData.objects['Gujarat']);
    var partiesData2012 = []
    var partiesData2017 = []
    var totalVotes2012 = 0
    var totalVotes2017 = 0
    var regionalConstituencies = []
    var BJP = {};
    var INC = {};
    var AAP = {};
    var Others = {
        2017 : {
            Party : "Others",
            Seats : 0,
            Votes : 0,
            VotePercent : 0
        },
        2012 : {
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

    function getWinnerPartyColor2012(d){
        var candidates;
        for(var i = 0; i<electionData2012.length; i++){
            if(electionData2012[i]['ac_no'] == d.properties.ac_no){
                candidates = electionData2012[i]['candidates']
                candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
                return color(candidates[0]['Party'])
            }
        }
    }

    function getWinnerPartyColor2017(d){
        var candidates;
        for(var i = 0; i<electionData2017.length; i++){
            if(electionData2017[i]['ac_no'] == d.properties.ac_no){
                candidates = electionData2017[i]['candidates']
                candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
                return color(candidates[0]['Party'])
            }
        }
    }

    function color(party){
        if(party === "Aam Aadmi Party"){
            return "#0066A4";
        }else if(party === "Indian National Congress"){
            return "#19AAED";
        }else if(party === "Bharatiya Janata Party"){
            return "#FF9933";
        }else{
            return '#909090'
        }
    }

    function addWinner2012(winner){
        totalVotes2012 += Number(winner['Total Votes'])
        for(var j=0; j<=partiesData2012.length; j++){
            if(partiesData2012[j] && partiesData2012[j].Party === winner.Party){
                partiesData2012[j].Seats += 1
                partiesData2012[j].Votes += Number(winner['Total Votes'])
                return 
            }
        }
        partiesData2012.push({
            Party : winner.Party,
            Seats : 1,
            Votes : Number(winner['Total Votes'])
        })
        return
    }

    function addWinner2017(winner){
        totalVotes2017 += Number(winner['Total Votes'])
        for(var j=0; j<=partiesData2017.length; j++){
            if(partiesData2017[j] && partiesData2017[j].Party === winner.Party){
                partiesData2017[j].Seats += 1
                partiesData2017[j].Votes += Number(winner['Total Votes'])
                return 
            }
        }
        partiesData2017.push({
            Party : winner.Party,
            Seats : 1,
            Votes : Number(winner['Total Votes'])
        })
        return
    }

    function addCandidate2012(candidate){
        totalVotes2012 += Number(candidate['Total Votes']);
          for(var j=0; j<=partiesData2012.length; j++){
              if(partiesData2012[j] && partiesData2012[j].Party === candidate.Party){
                  partiesData2012[j].Votes += Number(candidate['Total Votes'])
                  return 
              }
          }
          partiesData2012.push({
              Party : candidate.Party,
              Seats : 0,
              Votes : Number(candidate['Total Votes'])
          })
          return
      }
    
    function addCandidate2017(candidate){
      totalVotes2017 += Number(candidate['Total Votes']);
        for(var j=0; j<=partiesData2017.length; j++){
            if(partiesData2017[j] && partiesData2017[j].Party === candidate.Party){
                partiesData2017[j].Votes += Number(candidate['Total Votes'])
                return 
            }
        }
        partiesData2017.push({
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
        electionData2012.map(assembly => {
            if(regionalConstituencies.includes(Number(assembly.ac_no))){
                var candidates = sortCandidates(assembly.candidates);
                addWinner2012(candidates[0])
                for(var j=1; j< candidates.length;j++){
                    addCandidate2012(candidates[j])
                }
            }
            
        })
        electionData2017.map(assembly => {
            if(regionalConstituencies.includes(Number(assembly.ac_no))){
                var candidates = sortCandidates(assembly.candidates);
                addWinner2017(candidates[0])
                for(var j=1; j< candidates.length;j++){
                    addCandidate2017(candidates[j])
                }
            }
            
        })
    }else{
        electionData2012.map(assembly => {
            var candidates = sortCandidates(assembly.candidates);
            addWinner2012(candidates[0])
            for(var j=1; j< candidates.length;j++){
                addCandidate2012(candidates[j])
            }
        })
        electionData2017.map(assembly => {
            var candidates = sortCandidates(assembly.candidates);
            addWinner2017(candidates[0])
            for(var j=1; j< candidates.length;j++){
                addCandidate2017(candidates[j])
            }
        })
    }

    for(var k=0; k<partiesData2012.length;k++){
        partiesData2012[k].VotePercent = (partiesData2012[k].Votes/ (totalVotes2012 ? totalVotes2012 : 1) * 100).toFixed(2)
    }
    
    for(var k=0; k<partiesData2017.length;k++){
        partiesData2017[k].VotePercent = (partiesData2017[k].Votes/ (totalVotes2017 ? totalVotes2017 : 1) * 100).toFixed(2)
    }

    partiesData2012 = sortParties(partiesData2012)
    partiesData2017 = sortParties(partiesData2017)
    console.log(partiesData2012)
    partiesData2012.forEach(party => {
        if(party.Party === "Bharatiya Janata Party"){
            BJP['2012'] = party
        }else if(party.Party === "Indian National Congress"){
            INC['2012'] = party
        }else{
            Others['2012'].Seats += party.Seats;
            Others['2012'].Votes += party.Votes;
            Others['2012'].VotePercent = (Number(Others['2012'].VotePercent) + Number(party.VotePercent)).toFixed(2);
        }
    })
    
    partiesData2017.forEach(party => {
        if(party.Party === "Bharatiya Janata Party"){
            BJP['2017'] = party
        }else if(party.Party === "Indian National Congress"){
            INC['2017'] = party
        }else if(party.Party === "Aam Aadmi Party"){
            AAP['2017'] = party
        }else{
            Others['2017'].Seats += party.Seats;
            Others['2017'].Votes += party.Votes;
            Others['2017'].VotePercent = (Number(Others['2017'].VotePercent) + Number(party.VotePercent)).toFixed(2);
        }
    })

    useEffect(() => {
        const svg2012 = select(svgRef2012.current);
        const svg2017 = select(svgRef2017.current);
        // const {width,height} = dimensions || wrapperRef.current.getBoundingClientRect();
        const center =  [72.8,22.5]
        
        const projection = geoMercator().center(center).scale(5000).precision(100);
        const pathGenerator = geoPath().projection(projection);

        svg2012.selectAll('.assembly')
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
        .attr('stroke', "white")
        .attr('stroke-width' , '0.5px')
        .attr('fill', getWinnerPartyColor2012)
        .attr('d', assembly => pathGenerator(assembly));

        svg2017.selectAll('.assembly')
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
        .attr('stroke', "white")
        .attr('stroke-width' , '0.5px')
        .attr('fill', getWinnerPartyColor2017)
        .attr('d', assembly => pathGenerator(assembly));
    },[selectedRegion,assemblies.features])
    return (
        <div>
            <div  className='wrapper1' ref={wrapperRef}>
                <svg className='svg-2012' width={width * 0.48} height={height-214} ref={svgRef2012}></svg>
                <div className='region-data'>
                    <div className='party BJP'>
                        <div className='party-title'>BJP</div>
                        <div className='seats-won'>{BJP['2012'].Seats}</div>
                        <div className='vote-percent'>{BJP['2012'].VotePercent}</div>
                    </div>
                    <div className='party INC'>
                        <div className='party-title'>INC</div>
                        <div className='seats-won'>{INC['2012'].Seats}</div>
                        <div className='vote-percent'>{INC['2012'].VotePercent}</div>
                    </div>
                    <div className='party Others'>
                        <div className='party-title'>Others</div>
                        <div className='seats-won'>{Others['2012'].Seats}</div>
                        <div className='vote-percent'>{Others['2012'].VotePercent}</div>
                    </div>
                </div>
            </div>
            <div  className='wrapper2' ref={wrapperRef}>
                <svg className='svg-2017' width={width * 0.48} height={height-214} ref={svgRef2017}></svg>
                <div className='region-data'>
                    <div className='party BJP'>
                        <div className='party-title'>BJP</div>
                        <div className='seats-won'>{BJP['2017'].Seats}</div>
                        <div className='vote-percent'>{BJP['2017'].VotePercent}</div>
                    </div>
                    <div className='party INC'>
                        <div className='party-title'>INC</div>
                        <div className='seats-won'>{INC['2017'].Seats}</div>
                        <div className='vote-percent'>{INC['2017'].VotePercent}</div>
                    </div>
                    <div className='party AAP'>
                        <div className='party-title'>AAP</div>
                        <div className='seats-won'>{AAP['2017'].Seats}</div>
                        <div className='vote-percent'>{AAP['2017'].VotePercent}</div>
                    </div>
                    <div className='party Others'>
                        <div className='party-title'>Others</div>
                        <div className='seats-won'>{Others['2017'].Seats}</div>
                        <div className='vote-percent'>{Others['2017'].VotePercent}</div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default GujaratRegionMap;