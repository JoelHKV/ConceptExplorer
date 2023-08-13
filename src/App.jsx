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
    const [history, setHistory] = useState([])
    const [lastConcept, setLastConcept] = useState([])

    const [mapLocked, setMapLocked] = useState(false);

    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);

    const handleMapLockChange = (event) => {
        setMapLocked(event.target.checked);
    };
    const dispatch = useDispatch();


    const mapState = useSelector((state) => state.counter[0].mapState);
    const round = useSelector((state) => state.counter[0].round);


    const controlButtons = (param) => {
       // console.log(param)
        let thisHistory
        if (param === 'back') {
            if (typeof attribute !== history[history.length - 1]) {

                dispatch(newMapState({ dall: 'all', value: history[history.length - 1] }));
                for (let i = 0; i < 8; i++) {
                    dispatch(newMapState({ attribute: 'render', value: true, markerIndex: i }));
                }              
            }        
        }   
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
             
        setLastConcept(thisConcept)   

        
        const thisPolyline = {
            lat: [mapState.markers[0].lat * 0.7 + lat * 0.3, mapState.markers[0].lat * 0.3 + lat * 0.7],
            lng: [mapState.markers[0].lng * 0.7 + lng * 0.3, mapState.markers[0].lng * 0.3 + lng * 0.7],
            color: '#333333',
            render: true,
        }



         
        dispatch(newMapState({ value: thisPolyline, polylineIndex: 0 }));







        const oppositeSide = location !== 0 ? ((location + 4) > 8 ? (location + 4 - 8) : (location + 4)) : 0;      
        const newOptions = makeNewOptions(thisConcept, lastConcept, oppositeSide)
           
        updateMarkers(newOptions, [thisConcept, lastConcept], lat, lng)

        setTimeout(() => {
             updateOpacity(newOptions, [thisConcept, lastConcept])
             
        }, 400)
       
        console.log(mapState.lat)

        travel(mapState.lat, lat, mapState.lng, lng, 1)


        saveHistory()
    }

    const saveHistory = () => {
        const tempHist = [...history];
        tempHist[round] = mapState;
        setHistory(tempHist)

        dispatch(newRound(1));
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
                                mapLocked={mapLocked} 
                             
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

                <FormControlLabel
                    control={<Checkbox checked={mapLocked} onChange={handleMapLockChange} />}
                    label="Map Lock"
                />


                 
   


            </Grid>
        </Box >  
    );
};

export default App;