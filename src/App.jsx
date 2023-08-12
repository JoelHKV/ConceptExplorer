import React, { useState, useRef, useEffect } from 'react';
//import Hyphenator from 'hyphen';
//import hyphenateText from './hyphenateText';
import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newConcept, newMapState } from './reducers/quizGameSlice';
 
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

 

const diameter = 90;
 


const App = () => {

    const [concepts, setConcepts] = useState()
    const [conceptRank, setConceptRank] = useState()
    const [history, setHistory] = useState([])

    const [step, setStep] = useState(0)

   
   // const [mapData, setMapData] = useState(initMapData);
    const [listenIdle, setListenIdle] = useState(false);
    const zeroToEight = Array.from({ length: 9 }, (_, index) => index)
    const [markerIndexesMap, setMarkerIndexesMap] = useState(zeroToEight);
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
        
    }

    //let hisstep=-1

    const controlButtons = (param) => {
       // console.log(param)
        let thisHistory
        if (param === 'back') {
            //dispatch(newMapState({ attribute: 'lat', value: 50 }));
            dispatch(newMapState({ attribute: 'lat', value: 27.9749, element: 'marker', markerIndex: 0 }));

             
        }
      //  if (param === 'forward') {
      //      setStep(step + 1)
      //      thisHistory = history[history.length + 1 - step]
      // }
        
        
       // console.log(history.length + '  ' + step + ' his ' + thisHistory[0][0])
      //  const thisHistory = history[history.length - step]
       // console.log(thisHistory[0])
      //  markerFunction(thisHistory[0], thisHistory[1], thisHistory[2], thisHistory[3])
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
            sortedConcepts.splice(index, 0, lastConcept);
        }
        sortedConcepts.unshift(thisConcept);
        return sortedConcepts

         
    };


   
    const markerFunction = (thisConcept, location, lat, lng) => {

       
       
        if (location === 0 && thisConcept !== 'mind') {
            dispatch(newGameMode('details'))        
            return
        }

        if (conceptRank[thisConcept]['iskey'] == 0) {
            return
        }

        //const [markerIndexesMap, setMarkerIndexesMap] = useState(zeroToNine);

      
     //   const oppositeSide = (location === 0) ? '' : ((location - 4 + 8) % 8);
        // do not render the middle concept or the one that was clicked

       // const markerIndexesToRender = Array.from({ length: 9 }, (_, index) => index)
       //     .filter(index => index !== 0 && index !== location);

       // updatedArray
       // const markerIndexesToRender = updatedArray
       //     .filter(index => index !== updatedArray[0] && index !== location);

       
        const lastConcept = history.length > 0 ? history[history.length - 1][0][0] : [];       
        const newOptions = makeNewOptions(thisConcept, lastConcept)

        console.log(newOptions)



        const updatedMarkers = newOptions.map((markerTitle, i) => {
            
          //  const markerTitle = newOptions[index];
            const angleIncrement = (2 * Math.PI) / 8;
            const radius = i === 0 ? 0 : 2;
            let opacity = 0.5; // this and prev are never transparent
             
                 let formattedValue = 'NaN'
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
            console.log('udatemarkers' + markerTitle + ' ' + i)
           dispatch(newMapState({ value: thisMarker, markerIndex: i }));

          //  dispatch(newMapState({ attribute: 'opacity', value: 0, markerIndex: 0 }));
         //       dispatch(newMapState({ attribute: 'render', value: true, markerIndex: i }));
          //      dispatch(newMapState({ attribute: 'lat', value: (lat + radius * Math.cos((i) * angleIncrement)), markerIndex: i }));
          //      dispatch(newMapState({ attribute: 'lng', value: (lng + radius * Math.sin((i) * angleIncrement)), markerIndex: i }));
           //     dispatch(newMapState({ attribute: 'title', value: markerTitleUpperCase, markerIndex: i }));
           //     dispatch(newMapState({ attribute: 'param', value: markerTitle, markerIndex: i }));
           //    dispatch(newMapState({ attribute: 'opacity', value: opacity, markerIndex: i }));
           //     dispatch(newMapState({ attribute: 'diameter', value: diameter, markerIndex: i }));
           //     dispatch(newMapState({ attribute: 'dataURL', value: dt, markerIndex: i }));
            
           
      
            
                 



                })





      //  setHistory([...history, [newOptions, index, lat, lng]]);
        
     //   const updatedMarkers = hexaMarker(newOptions, lat, lng, 0.05, index)
       // upDateMap(updatedMarkers, lat, lng)

      
    //    setTimeout(() => {
    //        updatedMarkers.forEach((marker, index) => {
    //            let thisOpacity = 1;
    //            if (conceptRank[marker.param]['iskey'] == 0) {
    //                thisOpacity = 0.2;
    //            }              
   //             updatedMarkers[index].opacity = thisOpacity;                                       
   //         });
       
           // upDateMap(updatedMarkers)
  //      }, 400)

    }
  
  
    
    const upDateMap = (updatedMarkers, lat, lng) => {

     //   setMapData((mapData) => ({
      //      ...mapData,
      //     ...(updatedMarkers !== undefined ? { markers: updatedMarkers } : {}),
      //      ...(lat !== undefined ? { lat: lat } : {}),
      //      ...(lng !== undefined ? { lng: lng } : {}),
       // }));

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