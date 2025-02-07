import React, { useState } from 'react';
 
import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, newPolylineState, deleteMarkerState } from './reducers/conceptExplorerSlice';
 
import { Box } from '@mui/material'; // use MUI component library

import { fetchAllConcepts } from './hooks/fetchAllConcepts';

import GoogleMapsApp from './components/GoogleMapsApp';
import BottomButtons from './components/BottomButtons';
import OverlayBlock from './components/OverlayBlock';
import InstructionBlock from './components/InstructionBlock';
import MyFavicon from './components/MyFavicon';

import { drawCanvasSizeReturnDataURL } from './utilities/drawCanvasSizeReturnDataURL';
import { googleMapLoader } from './utilities/googleMapLoader';
import { conceptFlowerCoordinates } from './utilities/conceptFlowerCoordinates';
import { saveHistory } from './utilities/saveHistory';
import { thisFlight } from './utilities/googleMapFlight';


import './App.css'; 


const App = () => {

    //const cloudFunctionURL = 'https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore'
    const cloudFunctionURL = 'https://read-concepts-firestore-42285002133.europe-north1.run.app'
    const { concepts, globalData, loaded, error } = fetchAllConcepts(cloudFunctionURL);   
    const map = googleMapLoader();
     
    const [lastConcept, setLastConcept] = useState([])
    const [clickHistory, setClickHistory] = useState([])
    const [roundCounter, setRoundCounter] = useState(0)

    const [haltExecutionUntil, setHaltExecutionUntil] = useState(performance.now())
    const [haltClick, setHaltClick] = useState(false)

    const dispatch = useDispatch();

    const markerState = useSelector((state) => state.counter[0].markerState);
    const polylineState = useSelector((state) => state.counter[0].polylineState);
    const googleMapDimensions = useSelector((state) => state.counter[0].googleMapDimensions);
    const googlemapMarkerSizes = useSelector((state) => state.counter[0].googlemapMarkerSizes);
    const browseView = useSelector((state) => state.counter[0].browseView);
    const viewThreshold = useSelector((state) => state.counter[0].viewThreshold);
    const gameMode = useSelector((state) => state.counter[0].gameMode); //


    const processMarkerClick = (thisConcept, clickDirection, lat, lng, realMarkerClick) => {
        const haltExecution = computeHalt()
        if (haltExecution) { return }
        computeHalt(600)
           
        if (gameMode === 'browse' && clickDirection === 0 && realMarkerClick) { // center marker clicked while browsing            
            dispatch(newGameMode('details')) // open the popup for details
            return
        }
       
        setLastConcept(thisConcept)
           
        if (gameMode === 'globe' || !realMarkerClick) { // marker clicked in the globe view or emulated from a button
            dispatch(newGameMode('browse')) // browsing starts
            setRoundCounter(0);                       
            const thisLat = lat  
            const thisLng = lng 
            const destination = { lat: thisLat, lng: thisLng, zoom: browseView.zoom }
            // fly to the destination
            const flightTime = thisFlight(dispatch, newMapLocation, map, destination, viewThreshold)         
            computeHalt(flightTime + 400)

            setTimeout(() => { // set browsing markers
                hideExtraMarkers() // in reality we want to delete these extra markers but something goes wrong with quick delete and rewrite so this is a workaround for now            
                processMarkers(thisConcept, 0, thisLat, thisLng, false, false)               
            }, flightTime + 200);

            return
        }
                
        processMarkers(thisConcept, clickDirection, lat, lng, true, true) // make it the new center concept
        dispatch(newGameMode('browse'))
     
    }

    const processMarkers = (thisConcept, clickDirection, lat, lng, prevRoundExists, enablepolyline) => { 
        drawPolyline(0, 0, 0, 0, 1)

        if (markerState['Marker0'] && enablepolyline) {       
            drawPolyline(markerState['Marker0'].lat, markerState['Marker0'].lng, markerState['Marker' + clickDirection].lat, markerState['Marker' + clickDirection].lng, 0)
        }
      
        const lastChoice = clickHistory[roundCounter - 1];
        const last2ndChoice = clickHistory[roundCounter - 2];
        const clickBack = lastChoice ? Math.abs(lastChoice.clickDirection - clickDirection) == 4 : false;
       
        if (lastChoice && last2ndChoice && clickBack) { // click where we came from
            if (enablepolyline) {        
                drawPolyline(last2ndChoice.clickLat, last2ndChoice.clickLng, last2ndChoice.centerLat, last2ndChoice.centerLng, 1)          
            }
            setRoundCounter(prevRoundCounter => prevRoundCounter - 1);
            const newOptions = makeNewOptions(lastChoice.conceptName, last2ndChoice.conceptName, last2ndChoice.clickDirection)
           
            handleMapVisuals(newOptions, [lastChoice.conceptName, last2ndChoice.conceptName], lat, lng, prevRoundExists)
           
        }
        else {
                     
            if (clickDirection > 0) {  // click non-center marker and thereby move on
                setRoundCounter(prevRoundCounter => prevRoundCounter + 1);
            }
             
            const lastConceptIfHistory = prevRoundExists ? lastConcept : '';
            const newOptions = makeNewOptions(thisConcept, lastConceptIfHistory, clickDirection)
                    
            handleMapVisuals(newOptions, [thisConcept, lastConceptIfHistory], lat, lng, prevRoundExists)
                      
            const newHistory = saveHistory(clickHistory, markerState, clickDirection, roundCounter)
            setClickHistory(newHistory);
           
        }
                           
    }

    const makeNewOptions = (thisConcept, lastConcept, clickDirection) => {
  
        const originalOrderedConcepts = concepts[thisConcept]['ordered_concepts'];
        const clickingOrderedConcepts = originalOrderedConcepts.filter(concept => concept !== thisConcept && concept !== lastConcept);

        clickingOrderedConcepts.unshift(thisConcept); // the clicked concept goes to the beginning (middle)
        if (clickDirection > 0 && lastConcept.length > 0) { // did not click center concept, have history
            const oppositeClickDirection = (clickDirection + 4) > 8 ? (clickDirection + 4 - 8) : (clickDirection + 4);
            clickingOrderedConcepts.splice(oppositeClickDirection, 0, lastConcept); // arrange the previous concept opposite to the clicking direction to create the illusion of navigation
        }
        return clickingOrderedConcepts.slice(0, 9)
    }

    const handleMapVisuals = (newOptions, PivotItems, lat, lng, prevRoundExists) => {
        //console.log(newOptions, PivotItems, lat, lng, prevRoundExists)
        const minDimen = Math.min(googleMapDimensions.width, googleMapDimensions.height)
        const diameter = getMarkerDiameter('large')
        const flowerCoordinates = conceptFlowerCoordinates(lat, lng, minDimen/250)
        const opacity =  0.012
         
        updateMarkers(newOptions, PivotItems, flowerCoordinates[0], flowerCoordinates[1], opacity, diameter)
              
        setTimeout(() => {
              updateOpacity(newOptions, PivotItems, 0.6)           
        }, 500)



        setTimeout(() => {
            
        if (prevRoundExists) {
            dispatch(newMapLocation({ dall: 'dall', value: { pan: true, lat: lat, lng: lng } }));
            
        }
        else {
            dispatch(newMapLocation({ dall: 'dall', value: { pan: true, lat: lat, lng: lng, zoom: browseView.zoom } }));
        }
        }, 50)
    }

    const updateMarkers = (newOptions, keepBrightArray, lat, lng, opacity, diameter) => {  
            const updatedMarkers = newOptions.map((markerTitle, i) => {
                updateOneMarker(markerTitle, i, keepBrightArray, lat, lng, opacity, diameter);
            })    
             
    }

    const updateOneMarker = (markerTitle, i, keepBrightArray, lat, lng, opacity, diameter) => {
        let formattedValue = ''
        if (concepts[markerTitle] && concepts[markerTitle]['abstract'] !== undefined) {
            formattedValue = concepts[markerTitle]['abstract'].toFixed(0);

        }

        const markerTitleUpperCase = markerTitle.toUpperCase()
        const thisOpacity = keepBrightArray.includes(markerTitle) ? 1 : opacity

        const fireMarker = concepts.hasOwnProperty(markerTitle) ? markerTitle : null; // markers fire action only if they are keys in the database

        const thisMarker = {
            ...(lat[i] !== undefined ? { lat: lat[i] } : {}),
            ...(lng[i] !== undefined ? { lng: lng[i] } : {}),
            title: markerTitleUpperCase,
            param: fireMarker,
            opacity:  thisOpacity,
            diameter: diameter,
            dataURL: drawCanvasSizeReturnDataURL(diameter, markerTitleUpperCase, formattedValue, [0.9, 0.45, 0.35], diameter / 5),

        }

        dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker })); 

    }

    const drawPolyline = (fromlat, fromlng, tolat, tolng, index) => {

        const thisPolyline = {
            lat: [fromlat * 0.7 + tolat * 0.3, fromlat * 0.3 + tolat * 0.7],
            lng: [fromlng * 0.7 + tolng * 0.3, fromlng * 0.3 + tolng * 0.7],
            color: '#333333',
        }
       dispatch(newPolylineState({ polylineName: 'Polyline' + index, updatedData: thisPolyline }))
    }

    const updateOpacity = (newOptions, excludeMarkers, opacityValue) => {  
        const updatedMarkers = newOptions.map((markerTitle, i) => {
            if (!excludeMarkers.includes(markerTitle)) {                                      
                const opacity = concepts.hasOwnProperty(markerTitle) ? 1 : opacityValue; // transparent markers for concepts that cannot be examined (not keys in the database)
                dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: { opacity: opacity } }));
            }
        })
        
    }

    const getMarkerDiameter = (thisSize) => {
        const minDimen = Math.min(googleMapDimensions.width, googleMapDimensions.height);
        const diameter = minDimen * googlemapMarkerSizes[thisSize];
        return diameter

    }
    const hideExtraMarkers = () => { // this is a workaround until the issue with redux keeping track of map markers is solved
        for (let i = 9; i < Object.keys(markerState).length; i++) {
            dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: { opacity: 0.012 } }));
        }
    }

    const computeHalt = (waitTime) => {
        if (typeof waitTime === 'number') {
            setHaltExecutionUntil(performance.now() + waitTime)
            return
        }
        else {

            const halted = haltExecutionUntil - performance.now() > 0
            if (!halted && haltClick) {
                setHaltClick(false)
            }
            if (halted && !haltClick) {
                setHaltClick(true)
            }
            if (halted && haltClick) {
                setTimeout(() => {
                    computeHalt()
                }, 50);
            }
            return halted
        }

    }


    const haltExecution = computeHalt() // we need to run the function for every render to see whether buttom buttons are clickable, or animation is on.

    return (               
        <Box className="appContainer"> 
            <MyFavicon/>

            <GoogleMapsApp
                processMarkerClick={processMarkerClick}
                map={map}
             
            />

            {loaded &&   (                                  
                <BottomButtons
                    roundCounter={roundCounter}
                    setRoundCounter={setRoundCounter}
                    clickHistory={clickHistory}
                    loaded={loaded}
                    globalData={globalData}
                    processMarkers={processMarkers}
                    processMarkerClick={processMarkerClick}
                    updateMarkers={updateMarkers}
                    map={map}
                    computeHalt={computeHalt}
                    haltExecution={haltExecution}
                    getMarkerDiameter={getMarkerDiameter }                       
                />               
            )} 
            <InstructionBlock />
            {gameMode === 'details' && (
                <OverlayBlock
                    cloudFunctionURL={cloudFunctionURL}
                    abstractValue={concepts[lastConcept]['abstract']}
                    computeHalt={computeHalt}
                />
            )}                   
        </Box >            
    );
};

export default App;