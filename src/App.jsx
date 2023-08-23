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

    useEffect(() => {
        if (loaded) {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: 0, lng: 0, zoom: 2 } }));

            updateMarkers(globeConcepts, globeConcepts, latLngData.lat, latLngData.lng, 1, 60)

        }
    }, [loaded])



  

    const controlButtons = (param) => {
        console.log(gameMode)
        

        if (param === 'home') {
         //   dispatch(deletePolylineState({ polylineName: 'ALL' }))
        //    dispatch(deleteMarkerState({ markerName: 'ALL' }))
            deleteHistory()

            const firstChoice = optionChoiceHistory[0]; 

        
            processMarkers(firstChoice[0], 0, firstChoice[10], firstChoice[11], 'nohist', false)
        



            

        }

        if (param === 'back') {               
            const prevChoice = optionChoiceHistory[roundCounter - 1];
            const oppositeClickDirection = prevChoice[9] !== 0 ? ((prevChoice[9] + 4) > 8 ? (prevChoice[9] + 4 - 8) : (prevChoice[9] + 4)) : 0;
            processMarkers(prevChoice[0], oppositeClickDirection, prevChoice[10], prevChoice[11], 'hist', true)
        }
  

        if (param === 'route') {

            dispatch(newGameMode('route'))
            dispatch(deleteMarkerState({ markerName: 'ALL' }))
            dispatch(deletePolylineState({ polylineName: 'ALL' }))
               
            const latArray = [];
            const lngArray = [];
            const valArray = [];

            for (let i = 0; i < optionChoiceHistory.length; i++) {
                
                const thisStep = optionChoiceHistory[i];
                latArray.push(thisStep[10])
                lngArray.push(thisStep[11])
                valArray.push(thisStep[0])                            
                drawPolyline(thisStep[10], thisStep[11], thisStep[12], thisStep[13], i)

                 
            }


            setTimeout(() => {
                updateMarkers(valArray, valArray, latArray, lngArray, 1, diameter)
            }, 100);
 





            


            const minLat2 = Math.min(...latArray);
            const maxLat2 = Math.max(...latArray);
            const minLng2 = Math.min(...lngArray);
            const maxLng2 = Math.max(...lngArray);


            const thisMapLocation = {
                lat: (minLat2 + maxLat2) / 2, // Default latitude  
                lng: (minLng2 + maxLng2) / 2, // Default longitude  dall
                delta: Math.max((minLng2 - maxLng2), (minLat2 - maxLat2)),
            }


            dispatch(newMapLocation({ dall: 'dall', value: thisMapLocation }));

             

            
        }
        if (param === 'globe') {          
            dispatch(newGameMode('globe'))
            deleteHistory()

            dispatch(newMapLocation({ dall: 'dall', value: { lat: 0, lng: 0, zoom: 2  } }));

           
           // dispatch(newMarkerState({ markerName: 'ALL', updatedData: { delete: true } }))
            dispatch(deleteMarkerState({ markerName: 'ALL' }))
           
        

            updateMarkers(globeConcepts, globeConcepts, latLngData.lat, latLngData.lng, 1, 60)

            

        }


       
        if (param === 'random') {        
            const randInd = Math.floor(Math.random() * (globeConcepts.length + 0));
            showBaseConcept(randInd)
     
        }             
    }



    const showBaseConcept = (nro) => {
        const markerName = 'Marker' + nro;
        setLastConcept(markerState[markerName].param)
        dispatch(newMapLocation({ dall: 'dall', value: { lat: markerState[markerName].lat, lng: markerState[markerName].lng, delta: 5 } }));
  
    }



    const deleteHistory = () => {
        dispatch(deleteMarkerState({ markerName: 'ALL' }))
        dispatch(deletePolylineState({ polylineName: 'ALL' }))
        setOptionChoiceHistory([])
        setRoundCounter(0);

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

        if (gameMode === 'globe' && lastConcept !== thisConcept) { // concept clicked in the global view
            showBaseConcept(location) // centering and zooming in
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


        if (gameMode === 'browse' && location === 0) { // center concept in the browse mode clicked
            dispatch(newGameMode('details')) // we explore details
            return
        }

        if (gameMode === 'browse' && location > 0) {// edge concept in the browse mode clicked
            processMarkers(thisConcept, location, lat, lng, 'hist', true) // we make it the center concept
            return
        }

    }

    const processMarkers = (thisConcept, location, lat, lng, history, enablepolyline) => { 
        
        if (markerState['Marker0'] && enablepolyline) {
            drawPolyline(markerState['Marker0'].lat, markerState['Marker0'].lng, markerState['Marker' + location].lat, markerState['Marker' + location].lng, 0)

        }
        
        
        let clickDirection
        let pivotItems
        
        const lastArray = optionChoiceHistory[roundCounter - 1];
        const lastArray2 = optionChoiceHistory[roundCounter - 2];


        if (lastArray && lastArray2 && Math.abs(lastArray[9] - location) == 4) {
            // pressed back when enough history 
            if (enablepolyline) {
                drawPolyline(lastArray2[12], lastArray2[13], lastArray2[10], lastArray2[11], 1)
            }
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
            if (history === 'nohist') {
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
            handleMapVisuals(newOptions, pivotItems, lat, lng, history)

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