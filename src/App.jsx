import React, { useState, useRef, useEffect } from 'react';
//import Hyphenator from 'hyphen';
//import hyphenateText from './hyphenateText';
import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newConcept, newMapState, newRound } from './reducers/quizGameSlice';
 
import { Grid, Box, Switch, Typography, Slider, Checkbox, FormControlLabel } from '@mui/material'; // use MUI component library

 

import { drawCircleCanvas2ReturnDataURL } from './utilities/drawCircleCanvas2ReturnDataURL';

 

//import IntroBlock from './components/IntroBlock'; // instructions are here

import HeaderBlock from './components/HeaderBlock';
import GoogleMapsApp from './components/GoogleMapsApp';
import ModeButtonRow from './components/ModeButtonRow';
import OverlayBlock from './components/OverlayBlock';


import axios from 'axios';

import './App.css'; 

 

const diameter = 90;
 


const App = () => {

    const [concepts, setConcepts] = useState()
    const [conceptRank, setConceptRank] = useState()
     
    const [lastConcept, setLastConcept] = useState([])

    const [optionChoiceHistory, setOptionChoiceHistory] = useState([])

    const [backStep, setBackStep] = useState(0);

    
    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);


    const dispatch = useDispatch();


    const mapState = useSelector((state) => state.counter[0].mapState);
    const round = useSelector((state) => state.counter[0].round);

    console.log(lastConcept)


    const controlButtons = (param) => {
       // console.log(param)
       // let thisHistory
         
    }


   
 
    const makeNewOptions = (thisConcept, lastConcept, index) => {
         

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


    const updateMarkers = (newOptions, keepBrightArray, lat, lng) => {

        const updatedMarkers = newOptions.map((markerTitle, i) => {

            //  const markerTitle = newOptions[index];
            const angleIncrement = (2 * Math.PI) / 8;
            const radius = i === 0 ? 0 : 2;
            let opacity = 0.1;  

            if (keepBrightArray.includes(markerTitle)) {
                opacity = 1;
            } 


            let formattedValue = ''
            if (concepts[markerTitle] && concepts[markerTitle]['abstract'] !== undefined) {
                formattedValue = concepts[markerTitle]['abstract'].toFixed(1);

            }

            const markerTitleUpperCase = markerTitle.toUpperCase()

            const thisMarker = {
                lat: lat + radius * Math.cos((i) * angleIncrement), // Latitude of the first marker
                lng: lng + radius * Math.sin((i) * angleIncrement), // Longitude of the first marker
                title: markerTitleUpperCase, // Title of the first marker
                param: markerTitle,
                opacity: opacity,
                render: true,
                diameter: diameter,
                dataURL: drawCircleCanvas2ReturnDataURL(diameter, markerTitleUpperCase, formattedValue),

            }
            dispatch(newMapState({ value: thisMarker, markerIndex: i }));
        })
    }


   
    const markerFunction = (thisConcept, location, lat, lng) => {
        

        if (location === 0 && thisConcept !== 'mind') {
            dispatch(newGameMode('details'))
            return
        }

        if (conceptRank[thisConcept]['iskey'] == 0) {
            return
        }


        
     
       // console.log(oldOptionArray)
       // const [optionChoiceHistory, setOptionChoiceHistory] = useState([])

        drawPolyline(mapState.markers[0].lat, mapState.markers[0].lng, mapState.markers[location].lat, mapState.markers[location].lng, 0)


        const lastArray = optionChoiceHistory[optionChoiceHistory.length - 1 - backStep];
       // const lastArray0 = optionChoiceHistory[optionChoiceHistory.length - 0 - backStep]
        if (lastArray) {
            console.log(Math.abs(lastArray[9] - location))
            if (Math.abs(lastArray[9] - location) == 4) {
                const lastArray2 = optionChoiceHistory[optionChoiceHistory.length - 2 - backStep];
                drawPolyline(lastArray2[12], lastArray2[13], lastArray2[10], lastArray2[11], 1)
                setBackStep(backStep + 1)
                handleMapVisuals(lastArray.splice(0, 9), [], lat, lng)
                return
            }
            else {
                setBackStep(0)
            }
        }
        
       
        

        saveHistory(location)
        setLastConcept(thisConcept)   
                   
        const oppositeSide = location !== 0 ? ((location + 4) > 8 ? (location + 4 - 8) : (location + 4)) : 0;      
        const newOptions = makeNewOptions(thisConcept, lastConcept, oppositeSide)
           
        handleMapVisuals(newOptions, [thisConcept, lastConcept], lat, lng)
                
    }

    
    const handleMapVisuals = (newOptions, PivotItems, lat, lng) => {

        updateMarkers(newOptions, PivotItems, lat, lng)

        setTimeout(() => {
            updateOpacity(newOptions, PivotItems)

        }, 400)

        dispatch(newMapState({ attribute: 'lat', value: lat }));
        dispatch(newMapState({ attribute: 'lng', value: lng }));


    }
    const saveHistory = (location) => {
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

        const tempHist = [...optionChoiceHistory];
        tempHist.push(oldOptionArray);
        setOptionChoiceHistory(tempHist);

    }



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
        console.log(newOptions)
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



    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'
    const thisConcept = useSelector((state) => state.counter[0].concept); // 'intro' vs 'practice' vs 'quiz' vs 'finish'


    console.log(thisConcept)


    
    //console.log(thisConcept)

    

    const clickInfo = () => { // show introscreen
        dispatch(newGameMode('intro'))
    }

   
    
    

    useEffect(() => {
        console.log('effect')
        axios
            .get('https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore')
            .then(response => {
               // console.log('promise fulfilled')
                setConcepts(response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoaded(true);
            });
   
        axios
            .get('https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore?apikey=popularity')
            .then(response => {
                //console.log('promise fulfilled for otherData');
                setConceptRank(response.data);
            })
            .catch(error => {
                console.error('Error fetching otherData:', error);
            })
            .finally(() => {
                setLoaded2(true);
            });


    }, [])


   
    return (
        <Box className="appContainer">
            <Grid container className="gridContainer">
                <Grid item xs={12} className="first-row centerContent" >
                    <HeaderBlock />
                </Grid>
                <Grid item xs={12} className="second-row centerContent">
                    {loaded && loaded2 && (
                        <>
                        <GoogleMapsApp
                                
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
                   
                        <ModeButtonRow buttonFunction={controlButtons} />
                    
                </Grid>

      


                 
   


            </Grid>
        </Box >  
    );
};

export default App;