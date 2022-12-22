import React,{ useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom"
import "./Assembly.css"


const Assembly = () => {
    const location = useLocation()
    console.log(location)
    const ac_name = location.state?.assemblyData.ac_name
    const ac_no = location.state?.assemblyData.ac_no
    const candidates = location.state?.assemblyData.candidates

    function getPartyShortCode(party){
      if (party === "Bharatiya Janata Party"){
        return "BJP"
      }
      else if(party === "Indian National Congress"){
        return "INC"
      }
      else if(party === "Aam Aadmi Party"){
        return "AAP"
      }
      else{
        return "Others"
      }
    }
  return (
    <>
      <div className='ac_name_heading'> { ac_no +" - " + ac_name + " Assembly" }</div>
      <div className='candidates-list'>
        {
          candidates.map((candidate) => {
            return <div className={'candidate-list_item' + " " + getPartyShortCode(candidate.Party)}>
              <div className='candidate-list_image'></div>
              <div className='candidate-list_name'>{candidate.Candidate}</div>
              <div className='candidate-list_party'>{candidate.Party}</div>
              <div className='candidate-list_votes'>{candidate["Total Votes"]}</div>
              <div className='candidate-list_votepercent'>{candidate["Vote %"]}</div>
            </div>
          })
        }
      </div>
    </>
    
  );
}
export default Assembly;