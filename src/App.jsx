import React, { useState, useRef, useEffect } from 'react';
 
import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from './reducers/conceptExplorerSlice';
 
import { Box } from '@mui/material'; // use MUI component library

import { drawCanvasSizeReturnDataURL } from './utilities/drawCanvasSizeReturnDataURL';

import { fetchAllConcepts } from './hooks/fetchAllConcepts';

import GoogleMapsApp from './components/GoogleMapsApp';
import BottomButtons from './components/BottomButtons';
import OverlayBlock from './components/OverlayBlock';
import InstructionBlock from './components/InstructionBlock';

import MyFavicon from './components/MyFavicon';


import { googleMapLoader } from './utilities/googleMapLoader';



import { conceptFlowerCoordinates } from './utilities/conceptFlowerCoordinates';
import { saveHistory } from './utilities/saveHistory';
import { googleMapFlight, linearEasing, firstTwoThirdEasing, lastTwoThirdEasing, squareRootEasing } from './utilities/googleMapFlight';


import './App.css'; 


const App = () => {


    


    const faviconDataURL = drawCanvasSizeReturnDataURL(100, ' ', 'C', [0.9, 0.45, 0.35], 20)


    const [lastConcept, setLastConcept] = useState([])
  
    const [clickHistory, setClickHistory] = useState([])
    const [roundCounter, setRoundCounter] = useState(0)

    const [isFlying, setIsFlying] = useState(false)
  

    const dispatch = useDispatch();

    const markerState = useSelector((state) => state.counter[0].markerState);
    const polylineState = useSelector((state) => state.counter[0].polylineState);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);
    const map = googleMapLoader(mapLocation);


    const googleMapDimensions = useSelector((state) => state.counter[0].googleMapDimensions);
 
    const browseZoomLevel = useSelector((state) => state.counter[0].browseZoomLevel);
  
    const globalConceptZoomLevel = useSelector((state) => state.counter[0].globalConceptZoomLevel);

    const markerDiameterPerZoom = useSelector((state) => state.counter[0].markerDiameterPerZoom);

   
    const gameMode = useSelector((state) => state.counter[0].gameMode); //  
  
    const { concepts, globalData, loaded, error } = fetchAllConcepts('https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore');


    const getCurrentLocation = () => {
        const newCenter = map.getCenter();
        const zoomLevel = map.getZoom()
        return { lat: newCenter.lat(), lng: newCenter.lng(), zoom: zoomLevel }

    }

    const processMarkerClick = (thisConcept, clickDirection, lat, lng, newConcept) => {
        console.log(gameMode, newConcept )
        if (gameMode === 'browse' && clickDirection === 0 && !newConcept) { // we click the center marker while browsing
            dispatch(newGameMode('details')) // open the popup for details
            return
        }
        setLastConcept(thisConcept)

        const prevRoundExists = gameMode === 'browse'
   
        if (!prevRoundExists ||  newConcept) { // we start browsing from a new concept
            console.log('go to fly', gameMode, prevRoundExists)
            setRoundCounter(0);            
            dispatch(newGameMode('browse'))
            const markerName = 'Marker' + clickDirection;
            const googleMapPresentLocation = getCurrentLocation()      
            const hopRoute = googleMapPresentLocation.zoom > 4;

            


            let flyParams
            let flytime
            if (hopRoute) {
                flyParams = [linearEasing, linearEasing];
                flytime = 3400;
            }
            else {
                flyParams = [firstTwoThirdEasing, lastTwoThirdEasing];
                flytime = 1400;
            }
            setIsFlying(true)
           

          
            const thisLat = globalData.lat[clickDirection];
            const thisLng = globalData.lng[clickDirection];


            googleMapFlight(dispatch, newMapLocation, googleMapPresentLocation,
                { lat: thisLat, lng: thisLng, zoom: browseZoomLevel },
                flytime, flyParams[0], flyParams[1], hopRoute, setIsFlying)



            clickDirection = 0; // click direction makes no difference for the first concept

            setTimeout(() => {
            //    processMarkers(thisConcept, clickDirection, markerState[markerName].lat, markerState[markerName].lng, prevRoundExists, prevRoundExists)
                processMarkers(thisConcept, clickDirection, thisLat, thisLng, false, false)

            }, flytime + 1000);

            return
        }
        dispatch(newGameMode('browse'))
        processMarkers(thisConcept, clickDirection, lat, lng, true, true)

    }




    const processMarkers = (thisConcept, clickDirection, lat, lng, prevRoundExists, enablepolyline) => { 




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
            setTimeout(() => {
                handleMapVisuals(newOptions, [lastChoice.conceptName, last2ndChoice.conceptName], lat, lng, prevRoundExists)
            }, 50)
        }
        else {

           
            if (clickDirection > 0) {  // click non-center marker and thereby move on
                setRoundCounter(prevRoundCounter => prevRoundCounter + 1);
            }
         
            const lastConceptIfHistory = prevRoundExists ? lastConcept : '';
            const newOptions = makeNewOptions(thisConcept, lastConceptIfHistory, clickDirection)
            setTimeout(() => {
                handleMapVisuals(newOptions, [thisConcept, lastConceptIfHistory], lat, lng, prevRoundExists)
            }, 50)
            const newHistory = saveHistory(clickHistory, markerState, clickDirection, roundCounter)
            setClickHistory(newHistory);
        }
                           
    }

    const makeNewOptions = (thisConcept, lastConcept, clickDirection) => {
        //  setLastConcept(thisConcept)
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

        const minDimen = Math.min(googleMapDimensions.width, googleMapDimensions.height)
        const diameter = minDimen * markerDiameterPerZoom[browseZoomLevel] 
        const flowerCoordinates = conceptFlowerCoordinates(lat, lng, minDimen/250)
        const opacity = 0.1
        updateMarkers(newOptions, PivotItems, flowerCoordinates[0], flowerCoordinates[1], opacity, diameter)

        setTimeout(() => {
            updateOpacity(newOptions, PivotItems)

        }, 400)

        if (prevRoundExists) {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng } }));
            
        }
        else {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng, zoom: browseZoomLevel } }));
        }

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



    const drawPolyline = (fromlat, fromlng, tolat, tolng, index) => {

       // console.log('poly', fromlat, fromlng, tolat, tolng, index)

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
        <Box className="appContainer"> 
            <MyFavicon dataURL={faviconDataURL} />
            {loaded &&   (
                <>
                    <GoogleMapsApp  
                        processMarkerClick={processMarkerClick}
                        
                        map={map}
                
                    />
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
                        isFlying={isFlying}
                        setIsFlying={setIsFlying}
                        getCurrentLocation={getCurrentLocation}
                    />
                </>
            )} 
            <InstructionBlock />
            {gameMode === 'details' && (<OverlayBlock />)}                   
        </Box >            
    );
};

export default App;