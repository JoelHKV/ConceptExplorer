import React, { useState, useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, setMap } from './reducers/quizGameSlice';
 
import { Grid, Box } from '@mui/material'; // use MUI component library

 
import { drawCanvasReturnDataURL } from './utilities/drawCanvasReturnDataURL';
import { drawCircleCanvasReturnDataURL } from './utilities/drawCircleCanvasReturnDataURL';

 

//import IntroBlock from './components/IntroBlock'; // instructions are here

import HeaderBlock from './components/HeaderBlock';
import EightButtonRow from './components/EightButtonRow';
import BarChartArray from './components/BarChartArray';
import GoogleMapsApp from './components/GoogleMapsApp';

//import api from './utilities/api';

import axios from 'axios';


import './App.css'; 

 

const barData = [
    [
        { x: 'Basic vs. Complex', y: 0.3 },
        { x: 'Concrete vs. Symbolic', y: 0.7 },
        { x: 'Objective  vs.Subjective', y: 0.3 },
        { x: 'Intuitive vs.Analytical', y: 0.3 },
        { x: 'Empirical vs.Theoretical', y: 0.3 },
        { x: 'Quantitative vs.Qualitative', y: 0.3 },
        // Add more data points as needed
    ],
    // Add more datasets as needed
];

const diameter = 90;
//const dataURL = drawCanvasReturnDataURL(new Array(360).fill(1), diameter);
const dataURL =drawCircleCanvasReturnDataURL(diameter,'MIND')

const initMapData = {
    lat: 37.7749, // Default latitude  
    lng: -112.4194, // Default longitude  
   // zoom: 4, // Default zoom level
    delta: 2,
    markers: [
        {
            lat: 37.7749, // Latitude of the first marker
            lng: -112.4194, // Longitude of the first marker
            title: "mind", // Title of the first marker
            label: {              
                color: "black",
            },
            custom: {
                diameter: diameter,
                dataURL: dataURL,
            }
        },

    ],


    polylines: [],

};


//const opacity = i === 0 ? 1 : 0.1;
 



 

const App = () => {

    const [concepts, setConcepts] = useState()
    const [conceptRank, setConceptRank] = useState()
    const [history, setHistory] = useState([])

    
 
    const [mapData, setMapData] = useState(initMapData);
    const [listenIdle, setListenIdle] = useState(false);



    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [thisConcept, setThisConcept] = useState('mind');
    const [numData, setNumData] = useState(barData);



    const hexaMarker = (title, lat, lng, opac, index) => {

        let markerArray = conceptToRelated(title)
        if (history.length > 0) {
        markerArray = conceptToRelated2(title, history[history.length - 1][0], index-1)
        }
        console.log('index ' + index)
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



            return {
                lat: lat + radius * Math.cos((i) * angleIncrement),
                lng: lng + radius * Math.sin((i) * angleIncrement),
                title: markerTitle,
                opacity: opacity,
                label: {
                    text: markerTitle,
                    color: "black",
                },
                custom: {
                    diameter: diameter,
                    dataURL: dataURL,
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


    const markerFunction = (param, index, lat, lng) => {
        if (conceptRank[param]['iskey'] == 0) {
            return
        }
                  
        setHistory([...history, [param, index]]);

        hexaMarker(param, lat, lng, 0.03, index)

        const opacities = [1];

        opacities.forEach((opa, index) => {
            setTimeout(() => {
                hexaMarker(param, lat, lng, opa, index);
            }, 400 * (index + 1)); // Increment timeout for each iteration
        });




    }
  
 
    const appContainerRef = useRef(null);

    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'

    

    const dispatch = useDispatch();

    console.log(thisConcept)

    

    const clickInfo = () => { // show introscreen
        dispatch(newGameMode('intro'))
    }

    const handleModeChange = (newMode) => {
        dispatch(newGameMode(newMode))
       // setThisConcept()
    };

    const handleConceptChange = (newConcept) => {
        if (newConcept in concepts) {
            setThisConcept(newConcept)


            console.log(concepts[newConcept]['numerical'][0])
            

            const updatedBarData = barData.map((dataset) =>
                dataset.map((dataPoint, dataIndex) => ({
                    ...dataPoint,
                    y: concepts[newConcept]['numerical'][dataIndex],  
                }))
            );



            setNumData(updatedBarData)

        }
        else {
            console.log('The key does no exist in the object.');
        }
        
       // setthisDetail(details['forgetting curve'][0])


    };

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
                    <EightButtonRow
                            buttonFunction={handleConceptChange}
                            conceptData={concepts[thisConcept]}
                            thisConcept={thisConcept}
                            concept={concepts}
                            conceptRank={conceptRank}
                        />
                    )}
                </Grid>
                <Grid item xs={12} className="third-row centerContent">
                    {loaded && (
                        <div className="concept-details-text">
                            {concepts[thisConcept]['definition']}
                        </div>
                    )}
                </Grid>    
                <Grid item xs={12} className="fourth-row centerContent">
                    {loaded && (
                        <div className="concept-details-bar">
                            <BarChartArray data={numData} />
                        </div>
                    )}
                </Grid>                                          
                
                
                   
                <div>
                    {loaded && loaded2 && (
                        <button onClick={() => hexaMarker('mind', 37.7749, -112.4194)}>Reset Map Center</button>
                    )}
                    <GoogleMapsApp     
                        mapData={mapData}
                        handleIdleFunction={handleIdleFunction}
                        markerFunction={markerFunction}
                    />
                </div>

                                
            
            </Grid>
        </Box >  
    );
};

export default App;