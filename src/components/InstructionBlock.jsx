
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Typography } from '@mui/material';
import './InstructionBlock.css';

import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';

const InstructionBlock = ( ) => {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);
    const [introCounter, setIntroCounter] = useState(0);

    const dispatch = useDispatch();

    const instructionsText = [
        "Concept Explorer is a tool for exploring the conceptual world, much like how Google Maps is a tool for exploring the physical world. Concepts, similar to places, have distances between them, and Concept Explorer allows you to travel between related concepts, facilitating a deeper understanding of the conceptual world.",
        "Concept Explorer starts with Globe View, where you can explore the given starting concepts.These concepts are shown as markers on Google Maps, and you can scroll, zoom in and out on the map as if they were regular Google Map markers. Alternatively, you can click 'Random' to travel to a random starting concept. Once you have found a concept you want to explore, you can simply click the marker.",
        "The first click centers the map around the concept you want to explore, and the second click shows eight related concepts. Now you can just click any of these related concepts shown on the perimeter and make that the new center concept. Concept Explorer will then display eight concepts related to the new center concept.",
        "if you click the center concept again (while periferial ones are shown also) you will see a popup window that provides a summary of the concept. Additionally, you will find a link to Wikipedia if you wish to delve into the concept in detail.",
        "While exploring the concepts you can also:\n1) Click 'Home' to return to exploring the initial starting concept\n2) Click 'Back' to retrace the steps you have taken\n3) Click 'Route' to view the concepts you have recently explored"        
    ];
  


    const clickInfo = (event) => { // show introscreen

        if (event.target.closest('.navbutton') || event.target.closest('.xbutton')) {
            // Prevent the event from propagating further
            return;
        }
        maxMin()
      
    }

    const buttonLogo = expanded ? 'X' : '?';


    const xbuttonImage = drawCanvasSizeReturnDataURL(80, '', buttonLogo, [0.9, 0.7, 0.6], 30)
    const prevbuttonImage = drawCanvasSizeReturnDataURL(80, '', 'PREV', [0.9, 0.7, 0.6], 80 / 6)
    const nextbuttonImage = drawCanvasSizeReturnDataURL(80, '', 'NEXT', [0.9, 0.7, 0.6], 80 / 6)

    const takeStep = (increment) => {
        setIntroCounter(prevCounter => prevCounter + increment);
        return
    };

    const maxMin = () => {

        if (expanded) {
            setShowText(false)
            setExpanded(false)
            setIntroCounter(0)
            return
        }

        setExpanded(true);
        setTimeout(() => {
            setShowText(true)
        }, 500);
        return
    };

    const prevButtonDisabled = introCounter > 0 ? '' : 'navbuttondis';
    const nextButtonDisabled = introCounter < instructionsText.length - 1 ? '' : 'navbuttondis';

    return (
        <div className={`InstructionBlock ${expanded ? 'expanded' : ''}`} onClick={clickInfo}>
            <Typography className='InstructionBlock_Title' variant="h4">
                Concept Explorer              
            </Typography>
            {showText &&  (
                <>                                    
                    <Typography className='InstructionBlock_Text' variant="h6" style={{ whiteSpace: 'pre-line' }}>
                        {instructionsText[introCounter]}
                    </Typography>  

                    <img className={`navbutton ${prevButtonDisabled}`} src={prevbuttonImage} onClick={() => prevButtonDisabled === '' ? takeStep(-1) : ''} alt="Previous" />
                    <img className={`navbutton ${nextButtonDisabled}`} src={nextbuttonImage} onClick={() => nextButtonDisabled === '' ? takeStep(1) : ''} alt="Next" />
                    
                </>                              
            )}          
            <img className='xbutton' src={xbuttonImage} onClick={() => maxMin()} alt="Close" />    
        </div>
    );
};

export default InstructionBlock;

 