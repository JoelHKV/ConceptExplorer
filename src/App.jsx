import React, { useState, useRef, useEffect } from 'react';

 

import { Button, Slider, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { incrementRound, incrementPoint, zeroCounter, addQuizOptions, randomChoice, paintingSliderChoice, painterSliderChoice, newGameMode } from './reducers/quizGameSlice';

import './App.css';  

import CustomButtonGroup from './components/CustomButtonGroup';


const answerTimeout = 1200;

const preloadedImages = []
const { paintingNames, painters } = paintingLoader(); 
const maxPaintingIndex = paintingNames.length - 1;
const maxPainterIndex = painters.length - 1;

let introText = []

introText[0] = `Gallery Galore is a collection of AI-generated paintings that 
help you associate famous painters with their distinct painting styles.`;

introText[1] = `In the practice mode, you can browse through random 
paintings by clicking on the current painting. Alternatively,
you can change the title with the bottom slider and the painter with the right slider. You can try these options now.`;

introText[2] = `In the quiz mode, your task is to guess the painter's name. 
Who do you think is the author of this painting? Click one of the buttons below. Good luck!`;

introText[3] = `The border of the painting flashes green for the right answer and red for the wrong answer. Click on 'PRACTICE' or 'QUIZ' to start!`;


function paintingLoader() {
    // preloads painting images and populates preloadedImages[thisPaintingNro][thisPainterNro]
    const paintingNames = ['Reflections', 'Chaos and Order', 'Dreamscape', 'Beyond the Horizon', 'Melancholy', 'Inner Depths', 'Metamorphosis', 'Fragmented Memories', 'The Human Condition', 'Parallel Universe', 'Illusionary Worlds', 'Embrace of the Elements', 'Transcendence', 'Enchanted Forests', 'Sensory Overload', 'Timeless Beauty', 'Celestial Journey', 'The Endless Ocean', 'Shadows and Light', 'The Alchemy of Nature'];
    const painters = ['Leonardo da Vinci', 'Michelangelo Buonarroti', 'Vincent van Gogh', 'Pablo Picasso', 'Rembrandt van Rijn', 'Claude Monet', 'Johannes Vermeer', 'Salvador Dali', 'Henri Matisse', 'Paul Cezanne'];
    const stem = 'https://storage.googleapis.com/ai_dev_projects/arthouse/paintings/';
    const middle = '_in_';
    const end = '_style_painting__.jpg';

    paintingNames.forEach((painting, i) => {
        preloadedImages[i] = [];
        painters.forEach((painter, j) => {
            const thisPainting = painting.replace(/ /g, '_');
            const thisPainter = painter.replace(/ /g, '_');
            const totalnamestring = stem + thisPainting + middle + thisPainter + end;
            const image = new Image();
            image.src = totalnamestring;
            preloadedImages[i][j] = image;
        });
    });

    return { paintingNames, painters };
}




const App = () => {
 
    const [borderColorFlash, setborderColorFlash] = useState(''); // flashes the correct quiz answer

    const appContainerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(null);

    const handleResize = () => {
        if (appContainerRef.current) {
            const width = appContainerRef.current.getBoundingClientRect().width;
            setContainerWidth(width);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        handleResize();
    }, []);


    const nextIntro = () => {
        dispatch(incrementRound());
        dispatch(addQuizOptions(maxPainterIndex))


    };


    const handlePaintingSliderChange = (event, newValue) => {
        dispatch(paintingSliderChoice(newValue))
    };

    const handlePainterSliderChange = (event, newValue) => {
        dispatch(painterSliderChoice(newValue))
    };

    const clickPaintingRandom = () => { // shows a random painting after clicking a painting 
        if (gameMode === 'practice' || (gameMode === 'intro' && roundNro == 1)) {
            dispatch(randomChoice([maxPaintingIndex, maxPainterIndex]));
        }
    }

    const clickInfo = () => { // show introscreen
        dispatch(zeroCounter())
        dispatch(newGameMode('intro'))
    }

    const handleUserGuess = (painterGuess) => { // checks if the given quiz answer is correct
        console.log(painterGuess)
        if (painterGuess === painters[thisPainterNro]) {
            dispatch(incrementPoint()); // increment point for correct answer
            // button_
            setborderColorFlash('go-green');
        }
        else {
            setborderColorFlash('go-red');
        }

        if (gameMode === 'intro') {
            dispatch(incrementRound());
            dispatch(newGameMode('reveal_intro'))
        }
        else {
            dispatch(newGameMode('reveal'))
        }           

    }
 
    const handleModeChange = (newMode) => {
        dispatch(newGameMode(newMode))
        if (newMode === 'quiz') {
            dispatch(zeroCounter())
            dispatch(randomChoice([maxPaintingIndex, maxPainterIndex]))
            dispatch(addQuizOptions(maxPainterIndex));
        }
        if (gameMode === 'finish') {
            dispatch(zeroCounter())
        }
    };



   
    const roundNro = useSelector((state) => state.counter[0].roundNro); //round nro
    const thisPainterNro = useSelector((state) => state.counter[0].randPainter); // painter nro
    const thisPaintingNro = useSelector((state) => state.counter[0].randPainting); // painting nro
    const gameMode = useSelector((state) => state.counter[0].gameMode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'
    const roundTotal = useSelector((state) => state.counter[0].roundTotal); // total nro rounds
    const points = useSelector((state) => state.counter[0].points); // nro points
    const painterOptions = useSelector((state) => state.counter[0].painterOptions); // multiple choice options

  
    const dispatch = useDispatch();

    if (gameMode === 'reveal_intro') {
        setTimeout(() => {
            
            setborderColorFlash('');
        }, 2*answerTimeout);
    }
    if (gameMode === 'reveal') {
                setTimeout(() => {
                setborderColorFlash('');


            if (roundNro >= roundTotal - 1) {
                dispatch(newGameMode('finish')) // quiz over
            }
            else {
                dispatch(newGameMode('quiz'))
                dispatch(incrementRound()); // next round
                dispatch(randomChoice([maxPaintingIndex, maxPainterIndex])); // random painting
                dispatch(addQuizOptions(maxPainterIndex)); // make options
            }
                }, answerTimeout);
    }


    return (
        <>
            
            <div ref={appContainerRef} className="app-container unselectable">

                <div className="title">Gallery Galore</div>
                <div className="info_button">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => clickInfo()}
                    >
                        ?
                    </Button>
                </div>


                {(gameMode !== 'quiz' && gameMode !== 'reveal') && (
                <div className="top-buttons-or-counter">
                    <CustomButtonGroup
                        buttonNames={['practice', 'quiz']}
                        buttonClasses={['practice', 'quiz']}
                        buttonFunction={handleModeChange}
                    />
                </div>
            )}
               
          
                {(gameMode === 'quiz' || gameMode === 'reveal') && (
                <div className="top-buttons-or-counter">                   
                    Round: {roundNro + 1} / {roundTotal}             
                </div>
            )}
                    
                <div className={`painting-section ${borderColorFlash}`}>
               
                  
                    <img style={gameMode === 'practice' ? { cursor: 'pointer' } : {}}
                        src={preloadedImages[thisPaintingNro][thisPainterNro].src}
                        alt="Image"
                        onClick={clickPaintingRandom}                       
                    />
                    

                    {(gameMode === 'finish') && (
                    <>
                    <div>
                            <h2>Your score: {points} / {roundTotal}</h2>
                    </div>

                    </>
                )}
                 
                    {(gameMode === 'practice' || (gameMode === 'intro' && roundNro == 1)) && (
                    <>
                        <div className="painting-slider">
                            <Slider
                                value={thisPaintingNro}
                                onChange={handlePaintingSliderChange}
                                min={0}
                                max={maxPaintingIndex}
                                step={1}
                                marks
                            />
                        </div>              
                        <div className="painter-slider">
                            <Slider
                                value={thisPainterNro}
                                onChange={handlePainterSliderChange}
                                orientation="vertical"
                                min={0}
                                max={maxPainterIndex}
                                step={1}
                                marks
                            />
                            </div>


                    </>
                )}
                    {(gameMode === 'intro' || gameMode === 'reveal_intro') && (
                    <div className="intro-info-text">
                        <p>{introText[roundNro]}</p>
                            <div>
                                {(roundNro < 2) && (
                            <CustomButtonGroup
                                buttonNames={['read more']}
                                buttonFunction={nextIntro}
                                    />
                                )}
                        </div>
                    </div>
                    )}

                </div>
          
                {(gameMode === 'practice' || gameMode === 'reveal' || (gameMode === 'intro' && roundNro<2)) && (
                <div className="painting-name">
                    <Typography variant="h5">
                        {paintingNames[thisPaintingNro]}
                    </Typography>
                    <Typography variant="h5">
                    {painters[thisPainterNro]}
                    </Typography>
                </div>
               
             

            )}

                {(gameMode === 'quiz' || (gameMode === 'intro' && roundNro === 2)) && (                   
                <div className="painter-choice-buttons">
                        <CustomButtonGroup
                            buttonNames={[painters[painterOptions[0]], painters[painterOptions[1]], painters[painterOptions[2]], painters[painterOptions[3]]]}
                            buttonFunction={handleUserGuess}
                            rows={containerWidth>600 ? 2 : 4 }
                        />                   
                </div>
                )}
            </div>
        </>
    );
};

export default App;