import './App.css';
import HimachalAssemblyMap from './HimachalAssemblyMap';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HimachalRegionMap from './HimachalRegionMap';
import PageHeader from './PageHeader';
import GujaratRegionMap from './GujaratRegionMap';
import AndhraPradeshRegionMap from './AndhraPradeshRegionMap';


function App() {
    console.log("Started")
    
  return(
    <BrowserRouter>
      <PageHeader />
      <Routes>
        <Route path="/HimachalAssembly" exact element={<div> <HimachalAssemblyMap /></div>} />
        <Route path="/HimachalRegion" exact element={<HimachalRegionMap />}/> 
        <Route path="/GujaratRegion" exact element={<GujaratRegionMap />}/> 
        <Route path="/AndhraRegion" exact element={<AndhraPradeshRegionMap />}/> 
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;
