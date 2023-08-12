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
    lat: 27.7749, // Default latitude  
    lng: -112.4194, // Default longitude  
   // zoom: 4, // Default zoom level
    delta: 2,
    markers: [
        {
            lat: 27.7749, // Latitude of the first marker
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
    polylines: [
        {
            lat: [27.7749, 26.1349],
            lng: [-112.4194, -111.4194],
            color: '#0000ff',
            update: true,
        },

    ],


  

};


const App = () => {

    const [concepts, setConcepts] = useState()
    const [conceptRank, setConceptRank] = useState()
    const [history, setHistory] = useState([])

    const [step, setStep] = useState(0)

   
    const [mapData, setMapData] = useState(initMapData);
    const [listenIdle, setListenIdle] = useState(false);


    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
  

    const hexaMarker = (markerArray, lat, lng, opac, index) => {

        const updatedMarkers = markerArray.map((markerTitle, i) => {
            const angleIncrement = (2 * Math.PI) / 8;
            const radius = i === 0 ? 0 : 2;
            let opacity = (i === 0 || i === ((index - 4 + 8) % 8)) ? 1 : opac; // this and prev are never transparent

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

       // console.log(updatedMarkers[0].opacity)

        return updatedMarkers
        
    
    };


   
   


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
        let thisHistory
        if (param === 'back') {
            setStep(step - 1)
            thisHistory = history[history.length - 1 - step]
        }
        if (param === 'forward') {
            setStep(step + 1)
            thisHistory = history[history.length + 1 - step]
        }
        
        
        console.log(history.length + '  ' + step + ' his ' + thisHistory[0][0])
      //  const thisHistory = history[history.length - step]
       // console.log(thisHistory[0])
      //  markerFunction(thisHistory[0], thisHistory[1], thisHistory[2], thisHistory[3])
    }

 
    const makeNewOptions = (thisConcept, lastConcept, lastConceptClickPosition) => {
        const includesLastConcept = lastConcept.length > 0;

        const allAssociatedConcepts = concepts[thisConcept]['concepts'];
        const allrelatedConcepts = concepts[thisConcept]['related'];
        const allConceptsLastRemoved = [...new Set(allAssociatedConcepts.concat(allrelatedConcepts).filter(button => button !== lastConcept))];

        const sortedConcepts = allConceptsLastRemoved
            .map(button => ({
                button,
                importanceValue: 100 * conceptRank[button]['iskey'] + conceptRank[button]['count']
            }))
            .sort((a, b) => b.importanceValue - a.importanceValue)
            .slice(0, includesLastConcept ? 7 : 8)
            .map(item => item.button);

        if (includesLastConcept) { // if last concept was found include it in the array where it was clicked
            const insertionIndex = (lastConceptClickPosition - 4 + 8) % 8;
            sortedConcepts.splice(insertionIndex, 0, lastConcept);
        }

        return [thisConcept, ...sortedConcepts];
    };


   
    const markerFunction = (param, index, lat, lng) => {
        dispatch(newConcept(param))
        if (index === 0 && param !== 'mind') {
            dispatch(newGameMode('details'))        
            return
        }

        if (conceptRank[param]['iskey'] == 0) {
            return
        }
  

        const lastConcept = history.length > 0 ? history[history.length - 1][0][0] : [];
         
        const newOptions = makeNewOptions(param, lastConcept, index-1)

       
      

        setHistory([...history, [newOptions, index, lat, lng]]);
        
        const updatedMarkers = hexaMarker(newOptions, lat, lng, 0.05, index)
        upDateMap(updatedMarkers, lat, lng)

      
        setTimeout(() => {
            updatedMarkers.forEach((marker, index) => {
                let thisOpacity = 1;
                if (conceptRank[marker.param]['iskey'] == 0) {
                    thisOpacity = 0.2;
                }              
                updatedMarkers[index].opacity = thisOpacity;                                       
            });
       
            upDateMap(updatedMarkers)
        }, 400)

    }
  
  
    
    const upDateMap = (updatedMarkers, lat, lng) => {

        setMapData((mapData) => ({
            ...mapData,
            ...(updatedMarkers !== undefined ? { markers: updatedMarkers } : {}),
            ...(lat !== undefined ? { lat: lat } : {}),
            ...(lng !== undefined ? { lng: lng } : {}),
        }));

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