import React, { useState } from 'react';
import { ToggleButtonGroup, ToggleButton, Button, Slider, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { incrementRound, incrementPoint, zeroCounter, randomChoice, xSliderChoice, ySliderChoice, modeToggle } from './reducers/counterSlice';

import './App.css';  

import QuizBlock from './components/QuizBlock';


const getImageUrl = (horizontalSliderValue, verticalSliderValue) => {
    const painting_names = ['Reflections', 'Chaos and Order', 'Dreamscape', 'Beyond the Horizon', 'Melancholy', 'Inner Depths', 'Metamorphosis', 'Fragmented Memories', 'The Human Condition', 'Parallel Universe', 'Illusionary Worlds', 'Embrace of the Elements', 'Transcendence', 'Enchanted Forests', 'Sensory Overload', 'Timeless Beauty', 'Celestial Journey', 'The Endless Ocean', 'Shadows and Light', 'The Alchemy of Nature'];
    const painters = ['Leonardo da Vinci', 'Michelangelo Buonarroti', 'Vincent van Gogh', 'Pablo Picasso', 'Rembrandt van Rijn', 'Claude Monet', 'Johannes Vermeer', 'Salvador Dali', 'Henri Matisse', 'Paul Cezanne', 'Francisco Goya', 'Sandro Botticelli', 'Wassily Kandinsky', 'Edvard Munch', 'Caravaggio', 'Diego Velazquez', 'Gustav Klimt', 'Edouard Manet', 'Edward Hopper', 'Jan van Eyck', 'Pierre-Auguste Renoir', 'Titian', 'William Turner', 'Gustave Courbet', 'Jackson Pollock', 'Johannes Itten', 'Mark Rothko', 'Roy Lichtenstein', 'John Constable', 'Paul Gauguin', 'Joan Miro', 'Paul Klee', 'Claude Lorrain', 'JMW Turner', 'Jean-Francois Millet', 'Edgar Degas', 'Camille Pissarro', 'Pierre Bonnard', 'Kazimir Malevich', 'Marc Chagall', 'Georges Braque', 'Emile Nolde', 'Piet Mondrian', 'Diego Rivera', 'Frida Kahlo', 'Edward Burne-Jones', 'William Morris', 'Eugene Delacroix', 'Pierre Puvis de Chavannes'];

    const stem = 'https://storage.googleapis.com/ai_dev_projects/arthouse/paintings/';
    const middle = '_in_';
    const end = '_style_painting__.jpg';

    const thisPainting = painting_names[horizontalSliderValue].replace(/ /g, '_');
    const thisPainter = painters[verticalSliderValue].replace(/ /g, '_');

    const totalnamestring = stem + thisPainting + middle + thisPainter + end;

    return totalnamestring;
};


const makePainterOptions = (correctPainter, painter_count, totalNroOptions) => {
    const painteroptions = [];

    painteroptions.push({ painter: correctPainter, correct: true });

    while (painteroptions.length < totalNroOptions) {
        const randomValue = Math.floor(Math.random() * painter_count);
        if (!painteroptions.some(obj => obj.painter === randomValue)) {
            painteroptions.push({ painter: randomValue, correct: false });
        }
    }

    for (let i = painteroptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [painteroptions[i], painteroptions[j]] = [painteroptions[j], painteroptions[i]];
    }

    return painteroptions
};

const App = () => {



    const handleHorizontalSliderChange = (event, newValue) => {
        dispatch(xSliderChoice(newValue))
    };

    const handleVerticalSliderChange = (event, newValue) => {
        dispatch(ySliderChoice(newValue))
    };

    const handleRandomSliders = () => {
        if (playmode === 'practice') {
            dispatch(randomChoice());
        }

        
    }

    const handleInfo = () => {
        dispatch(zeroCounter())
        dispatch(modeToggle('intro'))
    }

    const handleButtonClick = (buttonnro, answer) => {
        let answerColor = 'go-red'
        if (answer) {        
            dispatch(incrementPoint());
            answerColor = 'go-green'
        }

        document.querySelector(`.option-${buttonnro} button`).classList.add(answerColor);

        setTimeout(() => {
            document.querySelector(`.option-${buttonnro} button`).classList.remove(answerColor);
            if (counter >= rounds - 1) {
                dispatch(modeToggle('finish'))
            }
            else {
                dispatch(incrementRound());
                dispatch(randomChoice());
            }
        }, 500);
    }

   
    const handleModeChange = (newMode) => {
        console.log(newMode)
        dispatch(modeToggle(newMode))
        dispatch(randomChoice())
        if (playmode === 'finish') {
            dispatch(zeroCounter())
        }
        };
   

    const painting_names = ['Reflections', 'Chaos and Order', 'Dreamscape', 'Beyond the Horizon', 'Melancholy', 'Inner Depths', 'Metamorphosis', 'Fragmented Memories', 'The Human Condition', 'Parallel Universe', 'Illusionary Worlds', 'Embrace of the Elements', 'Transcendence', 'Enchanted Forests', 'Sensory Overload', 'Timeless Beauty', 'Celestial Journey', 'The Endless Ocean', 'Shadows and Light', 'The Alchemy of Nature'];
    const painters = ['Leonardo da Vinci', 'Michelangelo Buonarroti', 'Vincent van Gogh', 'Pablo Picasso', 'Rembrandt van Rijn', 'Claude Monet', 'Johannes Vermeer', 'Salvador Dali', 'Henri Matisse', 'Paul Cezanne', 'Francisco Goya', 'Sandro Botticelli', 'Wassily Kandinsky', 'Edvard Munch', 'Caravaggio', 'Diego Velazquez', 'Gustav Klimt', 'Edouard Manet', 'Edward Hopper', 'Jan van Eyck', 'Pierre-Auguste Renoir', 'Titian', 'William Turner', 'Gustave Courbet', 'Jackson Pollock', 'Johannes Itten', 'Mark Rothko', 'Roy Lichtenstein', 'John Constable', 'Paul Gauguin', 'Joan Miro', 'Paul Klee', 'Claude Lorrain', 'JMW Turner', 'Jean-Francois Millet', 'Edgar Degas', 'Camille Pissarro', 'Pierre Bonnard', 'Kazimir Malevich', 'Marc Chagall', 'Georges Braque', 'Emile Nolde', 'Piet Mondrian', 'Diego Rivera', 'Frida Kahlo', 'Edward Burne-Jones', 'William Morris', 'Eugene Delacroix', 'Pierre Puvis de Chavannes'];

    const painting_count = painting_names.length
    const painter_count = 10
    
 


    const counter = useSelector((state) => state.counter[0].itemnro);
    const painternro = useSelector((state) => state.counter[0].randpainter);
    const paintingnro = useSelector((state) => state.counter[0].randpainting);
    const playmode = useSelector((state) => state.counter[0].playmode);
    const rounds = useSelector((state) => state.counter[0].rounds);
    const points = useSelector((state) => state.counter[0].points);

    const fourPainters = makePainterOptions(painternro, painter_count, 4)


    const dispatch = useDispatch();

    return (
        <div className="app-container unselectable"  >
            <div className="title-section">
                Gallery Galore
            </div>

            <div className="info_button-section">
                {(playmode === 'practice' || playmode === 'finish') && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleInfo()}
                >
                    ?
                    </Button>
                )}
            </div>
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
                    src={getImageUrl(paintingnro, painternro)} // Replace with your image source
                        alt="Image"
                    onClick={handleRandomSliders}
                        
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
                        {painting_names[paintingnro]}
                    </Typography>
                    <Typography variant="h5">
                        {painters[painternro]}
                    </Typography>
            </div>
            )}
            {playmode==='quiz' && fourPainters.map((option, index) => (
                <div className={`option-${index + 1}`} key={index}>
                    <Button variant="contained" color="primary" onClick={() => handleButtonClick(index + 1, option.correct)}>
                        {option.painter !== 1 ? painters[option.painter] : painters[option.painter].slice(0, 13)}
                        
                    </Button>
                </div>
            ))}

        </div>
 

    );
};

export default App;