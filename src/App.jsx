import React, { useState, useRef, useEffect } from 'react';


import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newConcept, newMapState, newRound } from './reducers/quizGameSlice';
 
import { Grid, Box, Switch, Typography, Slider, Checkbox, FormControlLabel } from '@mui/material'; // use MUI component library

import { drawCircleCanvas2ReturnDataURL } from './utilities/drawCircleCanvas2ReturnDataURL';

import { getConcept } from './hooks/getConcept';
 

//import IntroBlock from './components/IntroBlock'; // instructions are here

import HeaderBlock from './components/HeaderBlock';
import GoogleMapsApp from './components/GoogleMapsApp';
import ModeButtonRow from './components/ModeButtonRow';
import OverlayBlock from './components/OverlayBlock';


//import axios from 'axios';

import './App.css'; 

 

const diameter = 90;
 


const App = () => {
 
    const [lastConcept, setLastConcept] = useState([])

    const [optionChoiceHistory, setOptionChoiceHistory] = useState([])

    const dispatch = useDispatch();

    const mapState = useSelector((state) => state.counter[0].mapState);
    const round = useSelector((state) => state.counter[0].round);
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'
 
    const { concepts, conceptRank, loaded, error } = getConcept('https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore', 'https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore?apikey=popularity');
    //console.log(loaded)

    console.log(gameMode)


    const controlButtons = (param) => {
        console.log(gameMode)
        console.log(round)
        if (param === 'back') {
            const prevChoice = optionChoiceHistory[round - 1];
            const oppositeClickDirection = prevChoice[9] !== 0 ? ((prevChoice[9] + 4) > 8 ? (prevChoice[9] + 4 - 8) : (prevChoice[9] + 4)) : 0;
            markerFunction(prevChoice[0], oppositeClickDirection, prevChoice[10], prevChoice[11]);

        }
        if (param === 'home') {
            const firstChoice = optionChoiceHistory[0];
            dispatch(newMapState({ attribute: 'lat', value: firstChoice[10] }));
            dispatch(newMapState({ attribute: 'lng', value: firstChoice[11] }));        
        }

        if (param === 'route') {

            for (let i = 0; i < 9; i++) {
                dispatch(newMapState({ value: { delete: true, render: true }, markerIndex: i }));
            }

            let minLat = Number.POSITIVE_INFINITY;
            let maxLat = Number.NEGATIVE_INFINITY;
            let minLng = Number.POSITIVE_INFINITY;
            let maxLng = Number.NEGATIVE_INFINITY;


            for (let i = 0; i < optionChoiceHistory.length; i++) {

                const thisStep = optionChoiceHistory[i];
                const lat = thisStep[10];
                const lng = thisStep[11];
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
                minLng = Math.min(minLng, lng);
                maxLng = Math.max(maxLng, lng);
                const thisMarker = {
                    lat: lat,  
                    lng: lng,   
                    title: thisStep[0].toUpperCase(),  
                    param: null,
                    opacity: 1,
                    render: true,
                    diameter: diameter/2,
                    dataURL: drawCircleCanvas2ReturnDataURL(diameter/2, thisStep[0].toUpperCase(), ''),

                }
                dispatch(newMapState({ value: thisMarker, markerIndex: i }));



                drawPolyline(thisStep[10], thisStep[11], thisStep[12], thisStep[13], i)

                 
            }

            dispatch(newMapState({ attribute: 'lat', value: (minLat + maxLat) / 2 }));
            dispatch(newMapState({ attribute: 'lng', value: (minLng + maxLng) / 2 }));
            dispatch(newMapState({ attribute: 'delta', value: Math.max((minLng - maxLng), (minLat - maxLat)) / 3 }));


            
        }
        if (param === 'globe') {
            dispatch(newGameMode('globe2'))
            dispatch(newMapState({ markerIndex: null })); // delete existing markers


            dispatch(newMapState({ attribute: 'lat', value: 10 }));
            dispatch(newMapState({ attribute: 'lng', value: 0 }));
            dispatch(newMapState({ attribute: 'delta', value: null }));
            dispatch(newMapState({ attribute: 'zoom', value: 1 }));

            //const globeOptions = ['mind', 'emotion']
            const globeOptions = Object.keys(concepts).slice(0,10);
            const lat = [];
            const lng = [];

            for (let i = 0; i < globeOptions.length; i++) {
               lat.push(Math.random() * 180 - 90);
               lng.push(Math.random() * 360 - 180);
            }

            updateMarkers(globeOptions, globeOptions, lat, lng, 1)



        }


       
        if (param === 'random') {
        //    dispatch(newMapState({ attribute: 'delete', value: null }));
          // dispatch(newMapState({ markerIndex: null }));

            const diameter = 180;

            const dataURL = drawCircleCanvas2ReturnDataURL(diameter, 'ASA', '');


            dispatch(newMapState({ attribute: 'lat', value: null}));
            dispatch(newMapState({ attribute: 'lng', value: null }));

            dispatch(newMapState({ attribute: 'dataURL', value: dataURL, markerIndex: 0 }));
            dispatch(newMapState({ attribute: 'diameter', value: diameter, markerIndex: 0 }));
            dispatch(newMapState({ attribute: 'render', value: true, markerIndex: 0 }));




           // dispatch(newMapState({ polylineIndex: null }));
            console.log(gameMode)
        }


          
    }


    

    const handleZoomChangedFunction = (zoomLevel) => {
      
        console.log(gameMode)
        if (gameMode !== 'globe') { return }
        console.log('b')
        dispatch(newMapState({ attribute: 'lat', value: null }));
        dispatch(newMapState({ attribute: 'lng', value: null }));
        const diameter = 20 + 40 * zoomLevel;

        for (let i = 0; i < 8; i++) {
            console.log(mapState.markers[i].title)
            const thisName = 'dada'; 
            const dataURL = drawCircleCanvas2ReturnDataURL(diameter, thisName, '');

            dispatch(newMapState({ attribute: 'dataURL', value: dataURL, markerIndex: i }));
            dispatch(newMapState({ attribute: 'diameter', value: diameter, markerIndex: i }));
            dispatch(newMapState({ attribute: 'render', value: true, markerIndex: i }));
        }

     //   console.log(gameMode)
     //   if (gameMode === 'globe') {
            console.log(zoomLevel)
      //  }
       
    }

 
    const makeNewOptions = (pivotItems, index) => {

        const thisConcept = pivotItems[0];
        const lastConcept = pivotItems[1];

        const allAssociatedConcepts = concepts[thisConcept]['concepts'];
        const allrelatedConcepts = concepts[thisConcept]['related'];
        const allConceptsLastRemoved = [...new Set([...allAssociatedConcepts, ...allrelatedConcepts])]
            .filter(button => button !== lastConcept && button !== thisConcept);

        const sortedConcepts = allConceptsLastRemoved
            .map(button => ({
                button,
                importanceValue: 100 * conceptRank[button]['iskey'] + conceptRank[button]['count']
            }))
            .sort((a, b) => b.importanceValue - a.importanceValue)
            .slice(0, lastConcept.length>0 ? 7 : 8)
            .map(item => item.button);
         if (index > 0) {
             sortedConcepts.splice(index-1, 0, lastConcept);
         }
         sortedConcepts.unshift(thisConcept);
        return sortedConcepts

         
    };

    
    const updateMarkers = (newOptions, keepBrightArray, lat, lng, opacity) => {

        const updatedMarkers = newOptions.map((markerTitle, i) => {

            let formattedValue = ''
            if (concepts[markerTitle] && concepts[markerTitle]['abstract'] !== undefined) {
                formattedValue = concepts[markerTitle]['abstract'].toFixed(1);

            }

            const markerTitleUpperCase = markerTitle.toUpperCase()


            const thisOpacity = keepBrightArray.includes(markerTitle) ? 1 : opacity

            const fireMarker = conceptRank[markerTitle]['iskey'] ? markerTitle : null;
            // markers representing key concepts get to fire, periferials do not
             


            const thisMarker = {
                lat: lat[i],  
                lng: lng[i],  
                title: markerTitleUpperCase, // Title of the first marker
                param: fireMarker,
                opacity: thisOpacity,
                render: true,
                diameter: diameter,
                dataURL: drawCircleCanvas2ReturnDataURL(diameter, markerTitleUpperCase, formattedValue),

            }
            dispatch(newMapState({ value: thisMarker, markerIndex: i }));
        })
    }


   
    const markerFunction = (thisConcept, location, lat, lng) => { 
        console.log(thisConcept)
        if (gameMode === 'globe') { // we have chosen a concept to explore from the global view
            setOptionChoiceHistory([]) // delete browsing history
            dispatch(newMapState({ attribute: 'delta', value: 2 }));
         //   dispatch(newGameMode('browse'))
        }
        if (location === 0 && optionChoiceHistory.length >0) {
            dispatch(newGameMode('details'))
            return
        }
 
        if (mapState.polylines[1]) {
            dispatch(newMapState({ value: { delete: true, render: true }, polylineIndex: 1 }));
        }
     
        drawPolyline(mapState.markers[0].lat, mapState.markers[0].lng, mapState.markers[location].lat, mapState.markers[location].lng, 0)


        let clickDirection
        let pivotItems
         
        const lastArray = optionChoiceHistory[round - 1];
        const lastArray2 = optionChoiceHistory[round - 2];
        if (lastArray && lastArray2 && Math.abs(lastArray[9] - location) == 4) {
            // pressed back when enough history 
            drawPolyline(lastArray2[12], lastArray2[13], lastArray2[10], lastArray2[11], 1)              
            dispatch(newRound(-1))
            pivotItems = [lastArray[0], lastArray2[0]]
            clickDirection = lastArray2[9]
            console.log(round + ' ' + clickDirection)

             

        }
        else {
            // regular click 
            if (location > 0) { 
                dispatch(newRound(1))  
            }
            pivotItems = [thisConcept, lastConcept]
            clickDirection = location;
            saveHistoryByIndex(location, round)
            
        }
        setLastConcept(pivotItems[0])
        const oppositeClickDirection = clickDirection !== 0 ? ((clickDirection + 4) > 8 ? (clickDirection + 4 - 8) : (clickDirection + 4)) : 0;
        const newOptions = makeNewOptions(pivotItems, oppositeClickDirection)
        handleMapVisuals(newOptions, pivotItems, lat, lng)
                      
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

    
    const handleMapVisuals = (newOptions, PivotItems, lat, lng) => {

        const flowerCoordinates = conceptFlowerCoordinates(lat, lng)
        const opacity = 0.1
        updateMarkers(newOptions, PivotItems, flowerCoordinates[0], flowerCoordinates[1], opacity)

        setTimeout(() => {
            updateOpacity(newOptions, PivotItems)

        }, 400)

        dispatch(newMapState({ attribute: 'lat', value: lat }));
        dispatch(newMapState({ attribute: 'lng', value: lng }));
        

    }





    const saveHistoryByIndex = (location, index) => {
        const oldOptionArray = new Array(14);
        for (let i = 0; i < 9; i++) {
            oldOptionArray[i] = mapState.markers[i] ? mapState.markers[i].param : '';
        }

        const markerCoordinates = [
            mapState.markers[0].lat,
            mapState.markers[0].lng,
            mapState.markers[location].lat,
            mapState.markers[location].lng
        ];

        oldOptionArray[9] = location;
        oldOptionArray.splice(10, 0, ...markerCoordinates);

        // Create a new history array up to the specified index
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
            render: true,
        }
        dispatch(newMapState({ value: thisPolyline, polylineIndex: index }));

    }



    const updateOpacity = (newOptions, excludeMarkers) => {
        const updatedMarkers = newOptions.map((markerTitle, i) => {
            if (!excludeMarkers.includes(markerTitle)) {                          
                const opacity = conceptRank[markerTitle]['iskey'] ? 1 : 0.6;
                dispatch(newMapState({ attribute: 'opacity', value: opacity, markerIndex: i }));
                dispatch(newMapState({ attribute: 'render', value: true, markerIndex: i }));
        }
        })


    }

    const travel = (latStart, latEnd, lngStart, lngEnd, position) => {
         
        const latThis = latStart * (1 - position) + latEnd * position;
        const lngThis = lngStart * (1 - position) + lngEnd * position;

        dispatch(newMapState({ attribute: 'lat', value: latThis }));
        dispatch(newMapState({ attribute: 'lng', value: lngThis }));

        if (position < 1) {
            setTimeout(() => {
                travel(latStart, latEnd, lngStart, lngEnd, position+0.5)

            }, 200)
        }

    }



    //const thisConcept = useSelector((state) => state.counter[0].concept); // 'intro' vs 'practice' vs 'quiz' vs 'finish'


    


    

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
                            handleZoomChangedFunction={handleZoomChangedFunction}
                            markerFunction={markerFunction}
                        />
                            { gameMode==='details' && (
                            <OverlayBlock
                                    title={lastConcept}
                                    text={concepts[lastConcept]['definition']}
                                />
                            )}
                        </>
                    )}
                </Grid> 
                <Grid item xs={12} className="third-row centerContent">
                   
                    <ModeButtonRow
                        buttonFunction={controlButtons}
                        enabled={[round > 0, round > 0, round > 0, true, true]}
                    />
                    
                </Grid>

            </Grid>
        </Box >  
    );
};

export default App;