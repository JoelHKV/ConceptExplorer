import React, { useState, useRef, useEffect } from 'react';


import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from './reducers/conceptExplorerSlice';
 
import { Grid, Box, Switch, Typography, Slider, Checkbox, FormControlLabel } from '@mui/material'; // use MUI component library

import { drawCircleCanvas2ReturnDataURL } from './utilities/drawCircleCanvas2ReturnDataURL';

import { getConcept } from './hooks/getConcept';
 

//import IntroBlock from './components/IntroBlock'; // instructions are here

import HeaderBlock from './components/HeaderBlock';
import GoogleMapsApp from './components/GoogleMapsApp';
import ModeButtonRow from './components/ModeButtonRow';
import OverlayBlock from './components/OverlayBlock';


import './App.css'; 

const diameter = 90;
 
const App = () => {
 
    const [lastConcept, setLastConcept] = useState([])

   

    const [optionChoiceHistory, setOptionChoiceHistory] = useState([])
    const [optionChoiceHistory2, setOptionChoiceHistory2] = useState([])
    const [roundCounter, setRoundCounter] = useState(0)
  
    const dispatch = useDispatch();

   // const mapState = useSelector((state) => state.counter[0].mapState);
    const markerState = useSelector((state) => state.counter[0].markerState);
    const polylineState = useSelector((state) => state.counter[0].polylineState);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);
    
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'
  
    const { concepts, globeConcepts, latLngData, loaded, error } = getConcept('https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore');
    //console.log(loaded) conceptRank

    useEffect(() => {
        if (loaded) {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: 0, lng: 0, zoom: 2 } }));

            updateMarkers(globeConcepts, globeConcepts, latLngData.lat, latLngData.lng, 1, 60)

        }
    }, [loaded])



    const showBaseConcept = (nro) => {
        const markerName = 'Marker' + nro;
        setLastConcept(markerState[markerName].param)
        dispatch(newMapLocation({ dall: 'dall', value: { lat: markerState[markerName].lat, lng: markerState[markerName].lng, delta: 5 } }));
  
    }


    const resizeAllMarkers = (zoomLevel) => {

        if (gameMode !== 'globe') { return }

        const diamArray = [20, 40, 60, 80, 120, 160, 200, 280, 360, 420, 520, 620];
        const diameter = diamArray[zoomLevel];
        
        let i = 0;

        while (markerState['Marker' + i]) {
            const thisMarker = { ...markerState['Marker' + i] };
            thisMarker.diameter = diameter;
            thisMarker.dataURL = drawCircleCanvas2ReturnDataURL(diameter, thisMarker.title, '')
            dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker }));
            i++
        }
    }



    const deleteHistory = () => {
        dispatch(deleteMarkerState({ markerName: 'ALL' }))
        dispatch(deletePolylineState({ polylineName: 'ALL' }))
        setOptionChoiceHistory([])
        setRoundCounter(0);

    }


    const makeNewOptions = (thisConcept, lastConcept, clickDirection) => {
        setLastConcept(thisConcept)
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
                formattedValue = concepts[markerTitle]['abstract'].toFixed(1);

            }

            const markerTitleUpperCase = markerTitle.toUpperCase()
            const thisOpacity = keepBrightArray.includes(markerTitle) ? 1 : opacity
          
            const fireMarker = concepts.hasOwnProperty(markerTitle) ? markerTitle : null; // markers fire action only if they are keys in the database

            const thisMarker = {
                ...(lat[i] !== undefined ? { lat: lat[i] } : {}),  
                ...(lng[i] !== undefined ? { lng: lng[i] } : {}),
                title: markerTitleUpperCase, // Title of the first marker
                param: fireMarker,
                opacity: thisOpacity,
                diameter: diameter,
                dataURL: drawCircleCanvas2ReturnDataURL(diameter, markerTitleUpperCase, formattedValue),

            }
            dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker }));
           
        })
    }


   
    const markerFunction = (thisConcept, clickDirection, lat, lng) => {

        if (gameMode === 'globe' && lastConcept !== thisConcept) { // concept clicked in the global view
            showBaseConcept(clickDirection) // centering and zooming in
            return
        }

        if ((gameMode === 'globe' && lastConcept === thisConcept) || gameMode === 'route') { // the same concept re-clicked in the global view
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

    






        const clickBack = lastChoice ? Math.abs(lastChoice[9] - clickDirection) == 4 : false;
   
        if (lastChoice && last2ndChoice && clickBack) { // click where we came from


            console.log(optionChoiceHistory2[roundCounter - 1].clickDirection, lastChoice[9])
            console.log(optionChoiceHistory2[roundCounter - 1].conceptNameByDirection[0], lastChoice[0])




            if (enablepolyline) {
                drawPolyline(last2ndChoice[12], last2ndChoice[13], last2ndChoice[10], last2ndChoice[11], 1)
            }
            setRoundCounter(prevRoundCounter => prevRoundCounter - 1);
            const newOptions = makeNewOptions(lastChoice[0], last2ndChoice[0], last2ndChoice[9])
            setTimeout(() => {
                handleMapVisuals(newOptions, [lastChoice[0], last2ndChoice[0]], lat, lng, history)
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
            saveHistoryByIndex(clickDirection, roundCounter)
            saveHistoryByIndex2(clickDirection, roundCounter)
        }
                           
    }

    const conceptFlowerCoordinates = (lat, lng) => {
        const latArray = [];
        const lngArray = [];
        const angleIncrement = (2 * Math.PI) / 8;
        for (let i = 0; i < 9; i++) {
            const radius = i === 0 ? 0 : 2;
            latArray[i] = lat + radius * Math.cos(i * angleIncrement);
            lngArray[i] = lng + radius * Math.sin(i * angleIncrement);
        }
        return [latArray, lngArray]; 
    }

    
    const handleMapVisuals = (newOptions, PivotItems, lat, lng, history) => {

        const flowerCoordinates = conceptFlowerCoordinates(lat, lng)
        const opacity = 0.1
        updateMarkers(newOptions, PivotItems, flowerCoordinates[0], flowerCoordinates[1], opacity, diameter)

        setTimeout(() => {
            updateOpacity(newOptions, PivotItems)

        }, 400)

        if (history === 'nohist') {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng, delta: 2 } }));
        }
        else {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng } }));
        }

    }

    const saveHistoryByIndex2 = (clickDirection, index) => {
       
        const thisOptionData = {
            conceptNameByDirection: {},
            clickDirection: clickDirection,
            centerLat: markerState['Marker0'].lat,
            centerLng: markerState['Marker0'].lng,
            clickLat: markerState['Marker' + clickDirection].lat,
            clickLng: markerState['Marker' + clickDirection].lng,
        };

        for (let i = 0; i < 9; i++) {
            thisOptionData.conceptNameByDirection[i] = markerState['Marker' + i] ? markerState['Marker' + i].param : '';
             
        }

    
        const newHistory = [...optionChoiceHistory2.slice(0, index)];

        // Add the new history entry at the specified index
        newHistory[index] = thisOptionData;

        setOptionChoiceHistory2(newHistory);
    };



    const saveHistoryByIndex = (location, index) => {
        
        const oldOptionArray = new Array(14);
        for (let i = 0; i < 9; i++) {
            oldOptionArray[i] = markerState['Marker' + i] ? markerState['Marker' + i].param : ''; 
        }

        const markerCoordinates = [
            markerState['Marker0'].lat,
            markerState['Marker0'].lng,
            markerState['Marker' + location].lat,
            markerState['Marker' + location].lng
        ];


        oldOptionArray[9] = location;
        oldOptionArray.splice(10, 0, ...markerCoordinates);
        const newHistory = [...optionChoiceHistory.slice(0, index)];

        // Add the new history entry at the specified index
        newHistory[index] = oldOptionArray;

        setOptionChoiceHistory(newHistory);
    };
 

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

    const travel = (latStart, latEnd, lngStart, lngEnd, position) => {
         
        const latThis = latStart * (1 - position) + latEnd * position;
        const lngThis = lngStart * (1 - position) + lngEnd * position;

        dispatch(newMapLocation({ dall: 'dall', value: { lat: latThis, lng: lngThis } }));

        if (position < 1) {
            setTimeout(() => {
                travel(latStart, latEnd, lngStart, lngEnd, position+0.5)

            }, 200)
        }

    }

    const clickInfo = () => { // show introscreen
        dispatch(newGameMode('intro'))
    }
   
    return (
        <Box className="appContainer">
            <Grid container className="gridContainer">
                <Grid item xs={12} className="first-row centerContent" >
                    <HeaderBlock />
                </Grid>
                <Grid item xs={12} className="second-row centerContent">
                    {loaded && (
                        <>
                        <GoogleMapsApp
                                markerFunction={markerFunction}
                                resizeAllMarkers={resizeAllMarkers}
                        />
                            { gameMode==='details' && (
                            <OverlayBlock
                                    title={lastConcept}
                                    text={lastConcept}
                                />
                            )}
                        </>
                    )}
                </Grid> 
                <Grid item xs={12} className="third-row centerContent">
                   
                    <ModeButtonRow
                        
                        showBaseConcept={showBaseConcept}
                        globeConcepts={globeConcepts}
                        updateMarkers={updateMarkers}
                        deleteHistory={deleteHistory}
                        latLngData={latLngData}
                        optionChoiceHistory={optionChoiceHistory}
                        processMarkers={processMarkers}
                        roundCounter={roundCounter}
                        drawPolyline={drawPolyline}
                        diameter={diameter}
                        enabled={[roundCounter > 0, roundCounter > 0, roundCounter > 0, loaded, (gameMode === 'globe' || gameMode === 'zoomin')]}
                    />
                    
                </Grid>               
            </Grid>
        </Box >  
    );
};

export default App;