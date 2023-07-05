import React, { useState } from 'react';
import { Button, Slider, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { incrementRound, incrementPoint, zeroCounter, addQuizOptions, randomChoice, horizontalSliderChoice, verticalSliderChoice, modeToggle } from './reducers/counterSlice';

import './App.css';  

import QuizBlock from './components/QuizBlock';
import TitleBar from './components/TitleBar';

const preloadedImages = []
const [paintingNames, painters] = paintingLoader(); 
const painting_count = paintingNames.length
const painter_count = painters.length

function paintingLoader() {
    // preloads painting images and populates preloadedImages[paintingNro][painterNro]
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

    return [paintingNames, painters]
}



const App = () => {
 

    const [buttonColorCorrectAnsw, setButtonColorCorrectAnsw] = useState('');

    const handleHorizontalSliderChange = (event, newValue) => {
        dispatch(horizontalSliderChoice(newValue))
    };

    const handleVerticalSliderChange = (event, newValue) => {
        dispatch(verticalSliderChoice(newValue))
    };

    const clickPaintingRandom = () => { // clicked a painting, get a random one
        if (playmode === 'practice') {
            dispatch(randomChoice());
        }
    }

    const clickInfo = () => { // show introscreen
        dispatch(zeroCounter())
        dispatch(modeToggle('intro'))
    }

    const handleUserGuess = (buttonNro, painterGuess) => { // quiz answer has been given
        console.log(buttonNro, painterGuess, painternro)
        if (painterGuess === painternro) {
            dispatch(incrementPoint()); // increment point for right answer
            setButtonColorCorrectAnsw('go-green');
        }
        else {
            setButtonColorCorrectAnsw('go-red');
        }

        setTimeout(() => {
            setButtonColorCorrectAnsw('');
            if (counter >= rounds - 1) {
                dispatch(modeToggle('finish')) // quiz over
            }
            else {
                dispatch(incrementRound()); // next round
                dispatch(randomChoice()); // random painting
                dispatch(addQuizOptions()); // make options
            }
        }, 800);
    }

   
    const handleModeChange = (newMode) => {
        dispatch(modeToggle(newMode))
        if (newMode === 'quiz') {
            dispatch(randomChoice())
            dispatch(addQuizOptions());
        }
        if (playmode === 'finish') {
            dispatch(zeroCounter())
        }
        };
   
    const counter = useSelector((state) => state.counter[0].itemnro); //round nro
    const painternro = useSelector((state) => state.counter[0].randpainter); // painter nro
    const paintingnro = useSelector((state) => state.counter[0].randpainting); // painting nro
    const playmode = useSelector((state) => state.counter[0].playmode); // 'intro' vs 'practice' vs 'quiz' vs 'finish'
    const rounds = useSelector((state) => state.counter[0].rounds); // total nro rounds
    const points = useSelector((state) => state.counter[0].points); // nro points
    const painterOptions = useSelector((state) => state.counter[0].painterOptions); // multiple choice options

    const dispatch = useDispatch();

    return (
        <div className="app-container unselectable"  >

            <TitleBar clickInfo={clickInfo} playmode={playmode} />
 
            <div className="quiz_button-section">
                {(playmode === 'practice') && (
                <Button
                    variant="contained"
                    color="primary"
                        onClick={() => handleModeChange('quiz')}
                >
                        {playmode === 'practice' ? 'Quiz' : `${counter + 1} / ${rounds}`}
                    </Button>
                )}
                {(playmode === 'quiz') && (
                    <div className="round-counter" style={{ textAlign: 'left', fontSize: '1.5rem', padding: '10px', fontWeight: 'bold' }}>                   
                    {counter + 1} / {rounds}             
                </div>
                 )}
            </div>
          
            <div className="painting-section">
                {(playmode === 'practice' || playmode === 'quiz') && (
                    <img style={playmode === 'practice' ? { cursor: 'pointer' } : {}}
                        src={preloadedImages[paintingnro][painternro].src}
                        alt="Image"
                        onClick={clickPaintingRandom}                       
                    />
                )}
                {(playmode === 'finish') && (
                    <>
                    <div>
                        <h2>Your score: {points} / {rounds}</h2>
                    </div>
                    <div>
                        <QuizBlock handleModeChange={handleModeChange} playmode={playmode} />
                    </div>
                    </>
                )}
                {(playmode === 'intro') && (
                    
                    <div style={{ textAlign: 'left' }}>
                        <p>Gallery Galore is a fun way to learn about the styles of the most famous painters. The app contains 20 different titles, all drawn by the 10 most famous painters, resulting in a total of 200 AI-generated paintings.</p>
                        <p>In the practice mode, you can view random paintings by clicking on the current painting. Alternatively, you can use the bottom slider to change the title or the right slider to change the painter.</p>                       <p>In the quiz mode, you will be presented with four buttons, each displaying a different painter's name. Your task is to click on the button that corresponds to the painting shown.</p>
                        <div>
                            <QuizBlock handleModeChange={handleModeChange} playmode={playmode} />
                        </div>
                    </div>
        
                )}

                </div>
            {(playmode === 'practice' || playmode === 'intro') && (
                <div className="painting-slider">
                    <Slider
                        value={paintingnro}
                        onChange={handleHorizontalSliderChange}
                        min={0}
                        max={painting_count - 1}
                        step={1}
                        marks
                    />
                </div>
            )}
            {(playmode === 'practice' || playmode === 'intro') && (
                <div className="painter-slider">
                    <Slider
                        value={painternro}
                        onChange={handleVerticalSliderChange}
                        orientation="vertical"
                        min={0}
                        max={painter_count-1}
                        step={1}
                        marks
                    />                       
                </div>

            )}
            {playmode === 'practice' && (
                <div className="painting-name">
                    <Typography variant="h5">
                                {paintingNames[paintingnro]}
                            </Typography>
                            <Typography variant="h5">
                                {painters[painternro]}
                            </Typography>
                    </div>
            )}
            {playmode === 'quiz' && painterOptions.map((val, index) => (
                <div className={`option-${index + 1}`} key={index}>
                    <Button className={val === painternro ? buttonColorCorrectAnsw : ''} variant="contained" color="primary" onClick={() => handleUserGuess(index + 1, val)}>
                        {val !== 1 ? painters[val] : painters[val].slice(0, 13)}                       
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default App;