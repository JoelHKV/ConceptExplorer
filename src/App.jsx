import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from './reducers/conceptExplorerSlice';
 
import { Grid, Box } from '@mui/material'; // use MUI component library

import { drawCanvasSizeReturnDataURL } from './utilities/drawCanvasSizeReturnDataURL';

import { fetchAllConcepts } from './hooks/fetchAllConcepts';

import GoogleMapsApp from './components/GoogleMapsApp';
import BottomButtons from './components/BottomButtons';
import OverlayBlock from './components/OverlayBlock';
import InstructionBlock from './components/InstructionBlock';

import { conceptFlowerCoordinates } from './utilities/conceptFlowerCoordinates';
import { saveHistory } from './utilities/saveHistory';


import './App.css'; 


const App = () => {
 
    const [lastConcept, setLastConcept] = useState([])
  
    const [optionChoiceHistory, setOptionChoiceHistory] = useState([])
    const [roundCounter, setRoundCounter] = useState(0)
  
    const dispatch = useDispatch();

   // const mapState = useSelector((state) => state.counter[0].mapState);
    const markerState = useSelector((state) => state.counter[0].markerState);
    const polylineState = useSelector((state) => state.counter[0].polylineState);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);


    const browseZoomLevel = useSelector((state) => state.counter[0].browseZoomLevel);
    const singleConceptZoomLevel = useSelector((state) => state.counter[0].singleConceptZoomLevel);

    const globalConceptZoomLevel = useSelector((state) => state.counter[0].globalConceptZoomLevel);

    const markerDiameterPerZoom = useSelector((state) => state.counter[0].markerDiameterPerZoom);
   
    const gameMode = useSelector((state) => state.counter[0].gameMode); //  
  
    const { concepts, globalData, loaded, error } = fetchAllConcepts('https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore');

    const resizeAllMarkers = (zoomLevel) => {
        if (gameMode !== 'globe') { return }
       
        const diameter = markerDiameterPerZoom[zoomLevel];
        
        let i = 0;

        while (markerState['Marker' + i]) {
            const thisMarker = { ...markerState['Marker' + i] };
            thisMarker.diameter = diameter;
            thisMarker.dataURL = drawCanvasSizeReturnDataURL(diameter, thisMarker.title, '', [0.9, 0.45, 0.35], diameter/5)

            dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker }));
            i++
        }
    }

    const deleteHistory = () => {
       // dispatch(deleteMarkerState({ markerName: 'ALL' }))
       // dispatch(deletePolylineState({ polylineName: 'ALL' }))
        setOptionChoiceHistory([])
        setRoundCounter(0);

    }


    const makeNewOptions = (thisConcept, lastConcept, clickDirection) => {
      //  setLastConcept(thisConcept)
        const originalOrderedConcepts = concepts[thisConcept]['ordered_concepts'];
        const clickingOrderedConcepts = originalOrderedConcepts.filter(concept => concept !== thisConcept && concept !== lastConcept);

        clickingOrderedConcepts.unshift(thisConcept); // the clicked concept goes to the beginning (middle)
        if (clickDirection > 0 && lastConcept.length>0) { // did not click center concept, have history
            const oppositeClickDirection = (clickDirection + 4) > 8 ? (clickDirection + 4 - 8) : (clickDirection + 4);
            clickingOrderedConcepts.splice(oppositeClickDirection, 0, lastConcept); // arrange the previous concept opposite to the clicking direction to create the illusion of navigation
        }
        return clickingOrderedConcepts.slice(0, 9)
    }
   
    const updateMarkers = (newOptions, keepBrightArray, lat, lng, opacity, diameter) => {
         
        const updatedMarkers = newOptions.map((markerTitle, i) => {
             
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
                opacity: thisOpacity,
                diameter: diameter,
                dataURL: drawCanvasSizeReturnDataURL(diameter, markerTitleUpperCase, formattedValue, [0.9, 0.45, 0.35], diameter / 5),
          

            }
            dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker }));
           
        })
    }


    const markerFunction = (thisConcept, clickDirection, lat, lng) => {

        setLastConcept(thisConcept)

 

        if ( gameMode === 'globe' || gameMode === 'route') { // concept clicked in the global view or route view
            deleteHistory()
            dispatch(newGameMode('browse'))

            setTimeout(() => {
                processMarkers(thisConcept, 0, lat, lng, 'nohist', true) // we start exploring related concepts
            }, 100);
                    
            return
        }

        if (gameMode === 'browse' && clickDirection === 0) { // center concept in the browse mode clicked
            dispatch(newGameMode('details')) // we explore details
            return
        }

        if (gameMode === 'browse' && clickDirection > 0) {// edge concept in the browse mode clicked
            processMarkers(thisConcept, clickDirection, lat, lng, 'hist', true) // we make it the center concept
            return
        }

    }
  
    const processMarkers = (thisConcept, clickDirection, lat, lng, history, enablepolyline) => { 
        
        if (markerState['Marker0'] && enablepolyline) {
            drawPolyline(markerState['Marker0'].lat, markerState['Marker0'].lng, markerState['Marker' + clickDirection].lat, markerState['Marker' + clickDirection].lng, 0)

        }
        
        const lastChoice = optionChoiceHistory[roundCounter - 1];
        const last2ndChoice = optionChoiceHistory[roundCounter - 2];

        const clickBack = lastChoice ? Math.abs(lastChoice.clickDirection - clickDirection) == 4 : false;
   
        if (lastChoice && last2ndChoice && clickBack) { // click where we came from
   
            if (enablepolyline) {        
                drawPolyline(last2ndChoice.clickLat, last2ndChoice.clickLng, last2ndChoice.centerLat, last2ndChoice.centerLng, 1)          
            }
            setRoundCounter(prevRoundCounter => prevRoundCounter - 1);
            const newOptions = makeNewOptions(lastChoice.conceptName, last2ndChoice.conceptName, last2ndChoice.clickDirection)
            setTimeout(() => {
                handleMapVisuals(newOptions, [lastChoice.conceptName, last2ndChoice.conceptName], lat, lng, history)
            }, 50)
        }
        else {

           
            if (clickDirection > 0) {  // click non-center marker and thereby move on
                setRoundCounter(prevRoundCounter => prevRoundCounter + 1);
            }
         
            const lastConceptIfHistory = history === 'nohist' ? '' : lastConcept;
            const newOptions = makeNewOptions(thisConcept, lastConceptIfHistory, clickDirection)
            setTimeout(() => {
                handleMapVisuals(newOptions, [thisConcept, lastConceptIfHistory], lat, lng, history)
            }, 50)
            const newHistory = saveHistory(optionChoiceHistory, markerState, clickDirection, roundCounter)
            setOptionChoiceHistory(newHistory);
        }
                           
    }

 
    const handleMapVisuals = (newOptions, PivotItems, lat, lng, history) => {

        const flowerCoordinates = conceptFlowerCoordinates(lat, lng)
        const opacity = 0.1
        updateMarkers(newOptions, PivotItems, flowerCoordinates[0], flowerCoordinates[1], opacity, markerDiameterPerZoom[browseZoomLevel])

        setTimeout(() => {
            updateOpacity(newOptions, PivotItems)

        }, 400)

        if (history === 'nohist') {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng, zoom: browseZoomLevel } }));
        }
        else {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng } }));
        }

    }

    const drawPolyline = (fromlat, fromlng, tolat, tolng, index) => {
        const thisPolyline = {
            lat: [fromlat * 0.7 + tolat * 0.3, fromlat * 0.3 + tolat * 0.7],
            lng: [fromlng * 0.7 + tolng * 0.3, fromlng * 0.3 + tolng * 0.7],
            color: '#333333',
        }

       dispatch(newPolylineState({ polylineName: 'Polyline' + index, updatedData: thisPolyline }))

    }

    const updateOpacity = (newOptions, excludeMarkers) => {
        const updatedMarkers = newOptions.map((markerTitle, i) => {
            if (!excludeMarkers.includes(markerTitle)) {                                      
                const opacity = concepts.hasOwnProperty(markerTitle) ? 1 : 0.6; // transparent markers for concepts that cannot be examined (not keys in the database)
                dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: { opacity: opacity } }));

        }
        })

    }

 
    return (        
        
            <Box className="appContainer" style={{ zIndex: 1 }}>                    
                {loaded &&   (
                    <>
                        <GoogleMapsApp  
                            markerFunction={markerFunction}
                            resizeAllMarkers={resizeAllMarkers}
                        />
                        <BottomButtons
                            globalData={globalData}
                            loaded={loaded}
                            updateMarkers={updateMarkers}
                            deleteHistory={deleteHistory}
                            optionChoiceHistory={optionChoiceHistory}
                            processMarkers={processMarkers}
                            roundCounter={roundCounter}
                            drawPolyline={drawPolyline}
                        />
                    </>
                )} 
                <InstructionBlock />
                {gameMode === 'details' && (<OverlayBlock />)}                   
            </Box >  
               
    );
};

export default App;