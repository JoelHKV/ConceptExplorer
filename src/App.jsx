import React, { useState, useRef, useEffect } from 'react';
//import Hyphenator from 'hyphen';
//import hyphenateText from './hyphenateText';
import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newConcept } from './reducers/quizGameSlice';
 
import { Grid, Box } from '@mui/material'; // use MUI component library

 
import { drawCanvasReturnDataURL } from './utilities/drawCanvasReturnDataURL';
import { drawCircleCanvasReturnDataURL } from './utilities/drawCircleCanvasReturnDataURL';
import { drawCircleCanvas2ReturnDataURL } from './utilities/drawCircleCanvas2ReturnDataURL';

 

//import IntroBlock from './components/IntroBlock'; // instructions are here

import HeaderBlock from './components/HeaderBlock';
import GoogleMapsApp from './components/GoogleMapsApp';
import ModeButtonRow from './components/ModeButtonRow';
import OverlayBlock from './components/OverlayBlock';


//import api from './utilities/api';

import axios from 'axios';


import './App.css'; 

 

const diameter = 110;
 


const initMapData = {
    lat: 37.7749, // Default latitude  
    lng: -112.4194, // Default longitude  
   // zoom: 4, // Default zoom level
    delta: 2,
    markers: [
        {
            lat: 37.7749, // Latitude of the first marker
            lng: -112.4194, // Longitude of the first marker
            title: "MIND", // Title of the first marker
            param: "mind",
            label: {              
                color: "black",
            },
            custom: {
                diameter: diameter,
                dataURL: drawCircleCanvas2ReturnDataURL(diameter, 'MIND', 2.9),
            }
        },

    ],


    polylines: [],

};


const App = () => {

    const [concepts, setConcepts] = useState()
    const [conceptRank, setConceptRank] = useState()
    const [history, setHistory] = useState([])

    const [step, setStep] = useState(1)

   
    const [mapData, setMapData] = useState(initMapData);
    const [listenIdle, setListenIdle] = useState(false);


    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
  

    const hexaMarker = (title, lat, lng, opac, index) => {

        let markerArray = conceptToRelated(title)
        if (history.length > 0) {
        markerArray = conceptToRelated2(title, history[history.length - 1][0], index-1)
        }
        const updatedMarkers = markerArray.map((markerTitle, i) => {
            const angleIncrement = (2 * Math.PI) / 8;
            const radius = i === 0 ? 0 : 2;
            let opacity = i === 0 ? 1 : opac;
             
            if (history.length > 0)  {
                if (markerTitle === history[history.length - 1][0]) {
                    opacity = 1;
                  // offset = history[history.length][1]
                }
            }

            if (conceptRank[markerTitle]['iskey'] == 0) {
                opacity = 0.3;
            }

            let formattedValue = 'NaN'
            if (concepts[markerTitle] && concepts[markerTitle]['abstract'] !== undefined) {
                formattedValue = concepts[markerTitle]['abstract'].toFixed(1);
                
            }  
          
            return {
                lat: lat + radius * Math.cos((i) * angleIncrement),
                lng: lng + radius * Math.sin((i) * angleIncrement),
                title: markerTitle.toUpperCase(),
                param: markerTitle,
                opacity: opacity,
                
                custom: {
                    diameter: diameter,
                    dataURL: drawCircleCanvas2ReturnDataURL(diameter, markerTitle.toUpperCase(), formattedValue),
                },
            };
        });

        setMapData((mapData) => ({
            ...mapData,
            markers: updatedMarkers,
            lat: lat,
            lng: lng,
        }));
    };


    const conceptToRelated = (title) => {
        const buttonNames = [...concepts[title]['concepts'], ...concepts[title]['related']];
        return [
            title,
            ...buttonNames
                .map((button) => {
                    let importanceValue = 100 * conceptRank[button]['iskey'] + conceptRank[button]['count'];
                    return { button, importanceValue };
                })
                .sort((a, b) => b.importanceValue - a.importanceValue)
                .slice(0, 8)
                .map((item) => item.button)
        ];       
    }

    const conceptToRelated2 = (title, special, index) => {
        index = index - 4;
        if (index < 0) { index = index + 8; }
        const buttonNames = [...concepts[title]['concepts'], ...concepts[title]['related']];

        // Remove duplicates and ensure 'special' is not included twice
        const uniqueButtonNames = [...new Set(buttonNames.filter(button => button !== special))];

        const sortedButtons = uniqueButtonNames
            .map((button) => {
                let importanceValue = 100 * conceptRank[button]['iskey'] + conceptRank[button]['count'];
                return { button, importanceValue };
            })
            .sort((a, b) => b.importanceValue - a.importanceValue)
            .slice(0, 7)
            .map((item) => item.button);

        // Insert 'special' at the specified index
        sortedButtons.splice(index, 0, special);

        return [title, ...sortedButtons];
    }


    const handleIdleFunction = () => {
        if (listenIdle) { 
          //  setListenIdle(false)
        const updatedMarkers = mapData.markers.map((marker) => ({
            ...marker,
            opacity: 1,
        }));
            console.log('koria stoped')
        setMapData((mapData) => ({
            ...mapData,
            markers: updatedMarkers,
        }));

        }
       // console.log('koria stoped')
    }

    //let hisstep=-1

    const controlButtons = (param) => {
       // console.log(param)
         

        setStep(step + 1)
        
        console.log(step)
        const thisHistory = history[history.length - step]
       // console.log(thisHistory[0])
        markerFunction(thisHistory[0], thisHistory[1], thisHistory[2], thisHistory[3])
    }

    

   
    const markerFunction = (param, index, lat, lng) => {
        dispatch(newConcept(param))
        if (index === 0 && param !== 'mind') {
            dispatch(newGameMode('details'))        
            return
        }

        if (conceptRank[param]['iskey'] == 0) {
            return
        }
                  
        setHistory([...history, [param, index, lat, lng]]);

        hexaMarker(param, lat, lng, 0.03, index)

        const opacities = [1];

        opacities.forEach((opa, index) => {
            setTimeout(() => {
                hexaMarker(param, lat, lng, opa, index);
            }, 400 * (index + 1)); // Increment timeout for each iteration
        });
    }
  
 
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'
    const thisConcept = useSelector((state) => state.counter[0].concept); // 'intro' vs 'practice' vs 'quiz' vs 'finish'


    console.log(thisConcept)


    const dispatch = useDispatch();

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
                            mapData={mapData}
                            handleIdleFunction={handleIdleFunction}
                            markerFunction={markerFunction}
                        />
                            { gameMode==='details' && (
                            <OverlayBlock
                                    title={thisConcept}
                                    text={concepts[thisConcept]['definition']}
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