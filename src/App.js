import './App.css';
import React,{ useEffect, useRef, useState } from 'react';

import HimachalAssemblyMap from './HimachalAssemblyMap';
import Assembly from './Assembly/Assembly';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HimachalRegionMap from './HimachalRegionMap';
import PageHeader from './PageHeader';
import GujaratRegionMap from './GujaratRegionMap';
import AndhraPradeshRegionMap from './AndhraPradeshRegionMap';
import IndiaMap from './India';
import MCD from './MCD/MCD';
import GujaratAssemblyMap from './GujaratAssembly/GujaratAssemblyMap';
import TripuraAssemblyMap from './Tripura/TripuraAssembly';
import MeghalayaAssemblyMap from './Meghalaya/MeghalayaAssembly';
import AndhraEducation from './AndhraEducation/AndhraEducation';



function App() {
  const [electionData, setElectionData] = useState([]);

  return(
    <BrowserRouter>
      {/* <PageHeader /> */}
      <Routes>
        <Route path="/TripuraAssembly" exact element={<div> <TripuraAssemblyMap /></div>} />
        <Route path="/MeghalayaAssembly" exact element={<div> <MeghalayaAssemblyMap /></div>} />
        <Route path="/HimachalAssembly" exact element={<div> <HimachalAssemblyMap /></div>} />
        <Route path="/HimachalRegion" exact element={<HimachalRegionMap />}/> 
        <Route path="/GujaratRegion" exact element={<GujaratRegionMap />}/> 
        <Route path="/GujaratAssembly" exact element={<GujaratAssemblyMap />}/> 
        <Route path="/AndhraRegion" exact element={<AndhraPradeshRegionMap />}/> 
        <Route path='/Assembly' exact element={<Assembly />} />
        <Route path='/MCD' exact element={<MCD />} />
        <Route path="/india" exact element={<IndiaMap />}/> 
        <Route path='/' exact element={<AndhraEducation />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;
