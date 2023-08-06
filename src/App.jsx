import React, { useState, useRef, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode } from './reducers/quizGameSlice';
 
import { Button, Slider, Grid, Box } from '@mui/material'; // use MUI component library

import { VictoryChart, VictoryBar, VictoryTheme } from 'victory';
 


import CustomButtonGroup from './components/CustomButtonGroup'; // custom button array component
//import IntroBlock from './components/IntroBlock'; // instructions are here

import HeaderBlock from './components/HeaderBlock';
import EightButtonRow from './components/EightButtonRow';


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



const BarChart = ({ data }) => (
    <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [0, 1] }}
        domainPadding={{ x: [50, 0] }} 
        horizontal
    >
        <VictoryBar data={data}
            barWidth={20}  // Adjust the bar width as desired
            barRatio={1} // Adjust the spacing between bars


        />
    </VictoryChart>
);


const BarChartArray = ({ data }) => (

  


    <Box display="flex" flexWrap="wrap" justifyContent="center">
        {data.map((dataset, index) => (
            <BarChart key={index} data={dataset} />
        ))}
    </Box>
);

const App = () => {

    const [concepts, setConcepts] = useState()
    const [conceptRank, setConceptRank] = useState()

    


    const [loaded, setLoaded] = useState(false);
    const [thisConcept, setThisConcept] = useState('mind');
    const [numData, setNumData] = useState(barData);

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
                console.log('promise fulfilled')
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
                console.log('promise fulfilled for otherData');
                setConceptRank(response.data);
            })
            .catch(error => {
                console.error('Error fetching otherData:', error);
            });


    }, [])


   
    return (
        <Box className="appContainer">
            <Grid container className="gridContainer">
                <Grid item xs={12} className="first-row centerContent" >
                    <HeaderBlock />
                </Grid>
                <Grid item xs={12} className="second-row centerContent">
                    {loaded && (
                    <EightButtonRow
                            buttonFunction={handleConceptChange}
                            buttonNames={concepts[thisConcept]['concepts']}
                            conceptRank={conceptRank}
                        />
                    )}
                </Grid>
     

                 

                {(gameMode !== 'quiz' && gameMode !== 'reveal') && (
                    <div className="top-buttons-or-counter">
                        <CustomButtonGroup
                            buttonNames={[thisConcept]}
                            buttonFunction={handleModeChange}
                        />
                    </div>
                )}
                {loaded && (
                    <>
                    <div className="concept-buttons">
                        <CustomButtonGroup
                            buttonNames={concepts[thisConcept]['concepts']}
                            buttonFunction={handleConceptChange}
                            rows={4}
                        />
                    </div>
                        <div className="related-buttons">
                            <CustomButtonGroup
                                buttonNames={concepts[thisConcept]['related']}
                                buttonFunction={handleConceptChange}
                                rows={4}
                            />
                        </div>


                    </>
                )}
                {loaded && (
                <div className="concept-details-text">
                    {concepts[thisConcept]['definition'] }
                </div>
                )}
                    <div className="concept-details-bar">
                    <BarChartArray data={numData} />
                </div>


                                
            
            </Grid>
        </Box >  
    );
};

export default App;