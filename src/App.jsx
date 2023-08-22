import React, { useState, useRef, useEffect } from 'react';


import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState  } from './reducers/quizGameSlice';
 
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
    const [roundCounter, setRoundCounter] = useState(0)
  
    const dispatch = useDispatch();

   // const mapState = useSelector((state) => state.counter[0].mapState);
    const markerState = useSelector((state) => state.counter[0].markerState);
    const polylineState = useSelector((state) => state.counter[0].polylineState);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);
    
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'
  
    const { concepts, conceptRank, globeConcepts, latLngData, loaded, error } = getConcept('https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore', 'https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore?apikey=popularity');
    //console.log(loaded)

  

    const controlButtons = (param) => {
        console.log(gameMode)
        

        if (param === 'home') {
            setOptionChoiceHistory([]) // delete browsing history
            setRoundCounter(0);
            const firstChoice = optionChoiceHistory[0];

            markerFunction(firstChoice[0], 10, firstChoice[10], firstChoice[11]) 

            return

            dispatch(newMapLocation({ attribute: 'lat', value: firstChoice[10] }));
            dispatch(newMapLocation({ attribute: 'lng', value: firstChoice[11] }));

         

            dispatch(deletePolylineState({ polylineName: 'ALL' }))
            dispatch(deleteMarkerState({ markerName: 'ALL' }))
            

           // dispatch(newGameMode('globe'))
            

           


            //updateMarkers(globeConcepts, globeConcepts, latLngData.lat, latLngData.lng, 1, diameter)

            



        }

        if (param === 'back') {

            
            //const prevChoice = optionChoiceHistory[round - 1];
            const prevChoice = optionChoiceHistory[roundCounter - 1];


            

            const oppositeClickDirection = prevChoice[9] !== 0 ? ((prevChoice[9] + 4) > 8 ? (prevChoice[9] + 4 - 8) : (prevChoice[9] + 4)) : 0;
            markerFunction(prevChoice[0], oppositeClickDirection, prevChoice[10], prevChoice[11]);

        }
  

        if (param === 'route') {


            dispatch(deleteMarkerState({ markerName: 'ALL' }))

            dispatch(deletePolylineState({ polylineName: 'Polyline0' }))

            return
     
           // return
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
                    diameter: diameter/2,
                    dataURL: drawCircleCanvas2ReturnDataURL(diameter/2, thisStep[0].toUpperCase(), ''),

                }
                
                dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker }));

                drawPolyline(thisStep[10], thisStep[11], thisStep[12], thisStep[13], i)

                 
            }

            const thisMapLocation = {
                lat: (minLat + maxLat) / 2, // Default latitude  
                lng: (minLng + maxLng) / 2, // Default longitude  dall
                delta: Math.max((minLng - maxLng), (minLat - maxLat)),
            }

            dispatch(newMapLocation({ dall: 'dall', value: thisMapLocation }));

        //    dispatch(newMapLocation({ attribute: 'lat', value: (minLat + maxLat) / 2 }));
        //    dispatch(newMapLocation({ attribute: 'lng', value: (minLng + maxLng) / 2 }));
        //    dispatch(newMapLocation({ attribute: 'delta', value: Math.max((maxLng - minLng), (maxLat - minLat)) /3  }));


            
        }
        if (param === 'globe') {          
            dispatch(newGameMode('globe'))
            setOptionChoiceHistory([]) // delete browsing history
            setRoundCounter(0);

            dispatch(newMapLocation({ dall: 'dall', value: { lat: 0, lng: 0, zoom: 2  } }));

           
           // dispatch(newMarkerState({ markerName: 'ALL', updatedData: { delete: true } }))
            dispatch(deleteMarkerState({ markerName: 'ALL' }))
           
        

            updateMarkers(globeConcepts, globeConcepts, latLngData.lat, latLngData.lng, 1, 60)

            

        }


       
        if (param === 'random') {
          
            const randInd = Math.floor(Math.random() * (globeConcepts.length + 0));
             const markerName = 'Marker' + randInd;
            showBaseConcept(randInd)
            //dispatch(newMapLocation({ dall: 'dall', value: { lat: markerState[markerName].lat, lng: markerState[markerName].lng, delta: 5 } }));

           // markerFunction(markerState[markerName].param, 0, markerState[markerName].lat, markerState[markerName].lng)

            

        }

       


          
    }



    const showBaseConcept = (nro) => {
        const markerName = 'Marker' + nro;

        setLastConcept(markerState[markerName].param)


       // dispatch(newGameMode('zoomin'))
        dispatch(newMapLocation({ dall: 'dall', value: { lat: markerState[markerName].lat, lng: markerState[markerName].lng, delta: 5 } }));
      //  dispatch(newGameMode('zoomin'))
       // updateMarkers(globeConcepts, globeConcepts, [], [], 1, 220)
    }


    const handleZoomChangedFunction = (zoomLevel) => {
   
        
        if (gameMode === 'globe') {

            const diamArray = [20, 40, 60, 80, 120, 160, 200, 280, 360, 420, 520, 620]
            // const diameter = 30 + 20 * zoomLevel;
            const diameter = diamArray[zoomLevel];

            updateMarkers(globeConcepts, globeConcepts, [], [], 1, diameter)

        }
       
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

    
    const updateMarkers = (newOptions, keepBrightArray, lat, lng, opacity, diameter) => {

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
                ...(lat[i] !== undefined ? { lat: lat[i] } : {}),  
                ...(lng[i] !== undefined ? { lng: lng[i] } : {}),
                title: markerTitleUpperCase, // Title of the first marker
                param: fireMarker,
                opacity: thisOpacity,
                diameter: diameter,
                dataURL: drawCircleCanvas2ReturnDataURL(diameter, markerTitleUpperCase, formattedValue),

            }
          //  dispatch(newMapState({ value: thisMarker, markerIndex: i }));


            dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker }));


        })
    }


   
    const markerFunction = (thisConcept, location, lat, lng) => { 

        
        console.log(roundCounter)
  

        if (gameMode === 'globe' && lastConcept !== thisConcept) { // we have chosen a concept to explore from the global view
             //dispatch(newGameMode('browse'))
           // setLastConcept(thisConcept)
            showBaseConcept(location)
            return
        }
        if (gameMode === 'globe' && lastConcept === thisConcept) {
             
            dispatch(deleteMarkerState({ markerName: 'ALL' }))
             
                dispatch(newGameMode('browse'))

             
            




            location = 0;
        }


        if (location === 0 && optionChoiceHistory.length >0) {
            dispatch(newGameMode('details'))
            return
        }

        if (location === 10) {
            location = 0;
        }


        if (markerState['Marker0']) {
            drawPolyline(markerState['Marker0'].lat, markerState['Marker0'].lng, markerState['Marker' + location].lat, markerState['Marker' + location].lng, 0)

        }
        
        
        let clickDirection
        let pivotItems
        
       // const lastArray = optionChoiceHistory[round - 1];
       // const lastArray2 = optionChoiceHistory[round - 2];
        const lastArray = optionChoiceHistory[roundCounter - 1];
        const lastArray2 = optionChoiceHistory[roundCounter - 2];


        if (lastArray && lastArray2 && Math.abs(lastArray[9] - location) == 4) {
            // pressed back when enough history 
            drawPolyline(lastArray2[12], lastArray2[13], lastArray2[10], lastArray2[11], 1)              
            
            console.log('dada')
           setRoundCounter(prevRoundCounter => prevRoundCounter - 1);
            pivotItems = [lastArray[0], lastArray2[0]]
            clickDirection = lastArray2[9]
          //  console.log(round + ' ' + clickDirection)

             

        }
        else {
            // regular click 
            if (location > 0) { 
              //  dispatch(newRound(1)) 
               // setRoundCounter(roundCounter + 1);
                setRoundCounter(prevRoundCounter => prevRoundCounter + 1);
            }
            pivotItems = [thisConcept, lastConcept]
            if (gameMode === 'globe') {
                pivotItems = [thisConcept,'' ]
            }
            clickDirection = location;
         //   if (round > 0) {
            //saveHistoryByIndex(location, round)
            saveHistoryByIndex(location, roundCounter)

            
          //  }
            
        }
        setLastConcept(pivotItems[0])
        const oppositeClickDirection = clickDirection !== 0 ? ((clickDirection + 4) > 8 ? (clickDirection + 4 - 8) : (clickDirection + 4)) : 0;
        const newOptions = makeNewOptions(pivotItems, oppositeClickDirection)


        setTimeout(() => {
            handleMapVisuals(newOptions, pivotItems, lat, lng)

        }, 50)

        
                      
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
        updateMarkers(newOptions, PivotItems, flowerCoordinates[0], flowerCoordinates[1], opacity, diameter)

        setTimeout(() => {
            updateOpacity(newOptions, PivotItems)

        }, 400)

        if (gameMode === 'globe') {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng, delta: 2 } }));
        }
        else {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng } }));
        }
        

    }





    const saveHistoryByIndex = (location, index) => {
        const oldOptionArray = new Array(14);
        for (let i = 0; i < 9; i++) {
    //        oldOptionArray[i] = mapState.markers[i] ? mapState.markers[i].param : '';

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

        dispatch(newPolylineState({ polylineName: 'Polyline' + index, updatedData: thisPolyline }))

    }



    const updateOpacity = (newOptions, excludeMarkers) => {
        const updatedMarkers = newOptions.map((markerTitle, i) => {
            if (!excludeMarkers.includes(markerTitle)) {                          
                const opacity = conceptRank[markerTitle]['iskey'] ? 1 : 0.6;
                dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: { opacity: opacity } }));

        }
        })


    }

    const travel = (latStart, latEnd, lngStart, lngEnd, position) => {
         
        const latThis = latStart * (1 - position) + latEnd * position;
        const lngThis = lngStart * (1 - position) + lngEnd * position;

     //   dispatch(newMapLocation({ attribute: 'lat', value: latThis }));
     //   dispatch(newMapLocation({ attribute: 'lng', value: lngThis }));

        dispatch(newMapLocation({ dall: 'dall', value: { lat: latThis, lng: lngThis } }));




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
                        enabled={[roundCounter > 0, roundCounter > 0, roundCounter > 0, loaded, (gameMode === 'globe' || gameMode === 'zoomin')]}
                    />
                    
                </Grid>

                

            </Grid>
        </Box >  
    );
};

export default App;