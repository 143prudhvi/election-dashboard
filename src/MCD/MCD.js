import React,{ useEffect, useRef, useState } from 'react';
import {geoMercator, geoPath, select} from 'd3';
import {feature} from 'topojson-client';
import data from '../Data/MCD.json';
import electionData2017 from '../Data/MCD-2022.json';
import { Link } from 'react-router-dom';
import "./MCD.css"

const MCD = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const [selectedAssembly, setSelectedAssembly] = useState(Number("01"));
  var width = window.innerWidth;
  if(width > 720){
    width = 720
  }
  var height = window.innerHeight - 272;
  var assemblies = feature(data,data.objects['MCD']);
  
  var AAP = {
    Party : "AAP",
    Seats : 0,
    Votes : 0,
    VotePercent : 0
  }
  var BJP = {
    Party : "BJP",
    Seats : 0,
    Votes : 0,
    VotePercent : 0
  };
  var INC = {
    Party : "INC",
    Seats : 0,
    Votes : 0,
    VotePercent : 0
  };
  var Others = {
    Party : "Others",
    Seats : 0,
    Votes : 0,
    VotePercent : 0
  };
  var totalVotes = 0;
  var partiesData = []
  var assemblyData;
  function sortCandidates(candidates){
    candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
    return candidates
  }

  function sortParties(parties){
      parties.sort((a,b) => {return b['Seats'] - a['Seats']})
      return parties
  }

  function getPartyShortCode(party){
    if(party === "AAM AADMI PARTY"){
      return "AAP";
    }else if(party === "INDIAN NATIONAL CONGRESS"){
      return "INC";
    }else if(party === "BHARATIYA JANATA PARTY"){
      return "BJP";
    }else{
      return 'Others'
    }
  }

  function addWinner(winner){
    totalVotes += Number(winner['Total Votes'])
    for(var j=0; j<=partiesData.length; j++){
        if(partiesData[j] && partiesData[j].Party === winner.Party){
            partiesData[j].Seats += 1
            partiesData[j].Votes += Number(winner['Total Votes'])
            return 
        }
    }
    partiesData.push({
        Party : winner.Party,
        Seats : 1,
        Votes : Number(winner['Total Votes'])
    })
    return
  }

  function addCandidate(candidate){
    totalVotes += Number(candidate['Total Votes']);
      for(var j=0; j<=partiesData.length; j++){
          if(partiesData[j] && partiesData[j].Party === candidate.Party){
              partiesData[j].Votes += Number(candidate['Total Votes'])
              return 
          }
      }
      partiesData.push({
          Party : candidate.Party,
          Seats : 0,
          Votes : Number(candidate['Total Votes'])
      })
      return
  }

  electionData2017.map(assembly => {
    if(assembly["Ward No"] == selectedAssembly){
      assemblyData = assembly
    }
    var candidates = sortCandidates(assembly.candidates);
    addWinner(candidates[0])
    for(var j=1; j< candidates.length;j++){
        addCandidate(candidates[j])
    }
  })
  

  for(var k=0; k<partiesData.length;k++){
    partiesData[k].VotePercent = (partiesData[k].Votes/ totalVotes * 100).toFixed(2)
  }

  partiesData = sortParties(partiesData)

  partiesData.forEach(party => {
    if(party.Party === "BHARATIYA JANATA PARTY"){
        BJP = party
    }else if(party.Party === "INDIAN NATIONAL CONGRESS"){
        INC = party
    }
    else if(party.Party === "AAM AADMI PARTY"){
        AAP = party
    }else{
        Others.Seats += party.Seats;
        Others.Votes += party.Votes;
        Others.VotePercent = (Number(Others.VotePercent) + Number(party.VotePercent)).toFixed(2);
    }
  })


  function candidateHTML(candidate){
    return "<div class='status'></div><div class='candidate-wrapper'><div class='candidate-party'>" + candidate.Party + "</div>" + "<div class='candidate-image'></div><div class='candidate-name'>" + candidate.Candidate + "</div>" +"<div class='candidate-details'>" + "<div class='candidate-votes'>" + candidate['Total Votes'] + "</div>" +"</div>" + "</div>" 
  }
  
  function getCandidates(ac_no){
    var candidates;
    for(var i = 0; i<electionData2017.length; i++){
      if(electionData2017[i]['Ward No'] == ac_no){
        candidates = electionData2017[i]['candidates']
        candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
        if(candidates.length > 1){
          select('.candidate-1')
          .html(() => candidateHTML(candidates[0]))
          .attr("class" , "candidate-1 " + getPartyShortCode(candidates[0].Party))

          select('.candidate-2')
          .html(() => candidateHTML(candidates[1]))
          .attr("class" , "candidate-2 " + getPartyShortCode(candidates[1].Party))
        }
        select(".ac_no")
        .html(() => assemblyData["Ward No"] + " - " + assemblyData["Ward Name"] )

        if(assemblyData.declared){
          select(".candidate-1 .status").html(() => "Won")
          select(".candidate-2 .status").html(() => "Lost")
        }else{
          select(".candidate-1 .status").html(() => "Leading")
          select(".candidate-2 .status").html(() => "Trailing")
        }
        

      }
    }
  }

  function getWinnerPartyColor(d){
    var candidates;
    for(var i = 0; i<electionData2017.length; i++){
        if(electionData2017[i]['Ward No'] == d.properties['Ward No']){
            candidates = electionData2017[i]['candidates']
            candidates.sort((a,b) => {return b['Total Votes'] - a['Total Votes']})
            return color(candidates[0]['Party'])
        }
    }
  }

  function color(party){
    if(party === "AAM AADMI PARTY"){
      return "#0066A4";
    }else if(party === "INDIAN NATIONAL CONGRESS"){
      return "#19AAED";
    }else if(party === "BHARATIYA JANATA PARTY"){
      return "#FF9933";
    }else{
      return '#909090'
    }
  }
  useEffect(() => {
    const svg = select(svgRef.current);
    // const {width,height} = dimensions || wrapperRef.current.getBoundingClientRect();
    const center =  [77.5,28.63]
    const projection = geoMercator().fitSize([width-32,height-32], assemblies);
    const pathGenerator = geoPath().projection(projection);
    svg.selectAll('.assembly')
      .data(assemblies.features)
      .join('path')
      .on("click", (event, assembly) => {
        setSelectedAssembly( selectedAssembly ?  (selectedAssembly === Number(assembly.properties['Ward No'])) ? null : Number(assembly.properties['Ward No']) : Number(assembly.properties['Ward No']));
      })
      .attr('opacity', assembly => {
        getCandidates(selectedAssembly);
        return selectedAssembly ?  (selectedAssembly === Number(assembly.properties['Ward No'])) ? 1 : 0.8: 1;
      }
      )
      .attr('class','assembly')
      .transition()
      .attr('stroke', "white")
      .attr('stroke-width' , '0.5px')
      .attr('fill',getWinnerPartyColor)
      .attr('d', assembly => pathGenerator(assembly));
  },[selectedAssembly,assemblies])
  // setTimeout( () => {
  //   if(selectedAssembly==68){
  //     setSelectedAssembly(1)
  //   }
  //  else{setSelectedAssembly(selectedAssembly + 1)}} , 5000)

  return (
    <div ref={wrapperRef}>
      <div className="row align-items-stretch">
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">BJP</h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">{BJP.Seats}</span>
          </div>
        </div>
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">INC</h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">{INC.Seats}</span>
          </div>
        </div>
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">AAP</h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">{AAP.Seats}</span>
          </div>
        </div>
        <div className="c-dashboardInfo col-lg-3 col-md-6">
          <div className="wrap">
            <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">Others</h4>
            <span className="hind-font caption-12 c-dashboardInfo__count">{Others.Seats}</span>
          </div>
        </div>
      </div>
      <div className='candidate-1'></div>
      <div className='map'>
        <div className='ac_no'></div>
        <svg className='svg-map' width={width} height={height} ref={svgRef}></svg>
      </div>
      <div className='candidate-2'></div>
      
    </div>
    
  );
}

export default MCD;