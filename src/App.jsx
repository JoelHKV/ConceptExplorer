import React, { useState, useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, setMap } from './reducers/quizGameSlice';
 
import { Grid, Box } from '@mui/material'; // use MUI component library

 
import { drawCanvasReturnDataURL } from './utilities/drawCanvasReturnDataURL';

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

const diameter = 70;
const initMapData = {
    lat: 37.7749, // Default latitude  
    lng: -112.4194, // Default longitude  
    zoom: 10, // Default zoom level

    markers: [
        {
            lat: 37.7749, // Latitude of the first marker
            lng: -112.4194, // Longitude of the first marker
            title: "Koira", // Title of the first marker
            label: {
                text: "Koira",
                color: "black",
            },
            custom: {
                diameter: diameter,
                dataURL: drawCanvasReturnDataURL(new Array(360).fill(1), diameter)
            }
        },
    
    ],

    polylines: [
        {
            lat: [37.8249, 37.7349],  
            lng: [-112.8194,- 111.9194],   
            color: '#0000ff',           
        },

    ],





};



 

const App = () => {

    const [concepts, setConcepts] = useState()
    const [conceptRank, setConceptRank] = useState()

    const [map, setMap] = useState(null);
   
    const [mapData, setMapData] = useState(initMapData);



    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);
    const [thisConcept, setThisConcept] = useState('mind');
    const [numData, setNumData] = useState(barData);

    const updateMapCenterAndZoom = (lat2, lng, zoom) => {

    //    setMapData((mapData) => ({
    //        ...mapData,
    //        zoom: (mapData.zoom + 1),
     //   }));
      
      //  markers[1].setMap(null);

         
              setMapData((mapData) => ({
            ...mapData,
                  markers: mapData.markers.map((marker, index) => {
                      if (index === 0) {
                          return {
                              ...marker,
                              lat: 37.4349,
                              lng: -112.4194,
                          };
                      }
                     
                      return marker;
                  })    
        }));
      
        
    };


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
                <button
                    onClick={() => updateMapCenterAndZoom(40.7128, -74.0060, 14)}
                >
                    Change Center to New York
                </button>

                
                   
                <div>
              
                    <GoogleMapsApp
                        map={map}
                        setMap={setMap}
       
                        mapData={mapData}
                    />
                </div>

                                
            
            </Grid>
        </Box >  
    );
};

export default App;