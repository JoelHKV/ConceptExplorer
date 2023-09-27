
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Typography } from '@mui/material';
import './InstructionBlock.css';

import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';

const InstructionBlock = ( ) => {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);
    const [closing, setClosing] = useState(false);

    const [introCounter, setIntroCounter] = useState(0);

    //const dispatch = useDispatch();

    const instructionsText = [
        "Concept Explorer is an educational app for understanding concepts, which are fundamental building blocks in thinking. With Concept Explorer, you can learn not only the definitions but also how concepts relate to one another. For instance, <em>Mind</em> and <em>Consciousness</em> are closely related in the <em>conceptual space</em>, much like how <em> Belgium</em> and <em>the Netherlands</em> are closely located in the <em>physical space</em>.",
        "Concept Explorer starts with <strong>Globe View</strong>, displaying a Google Map with custom markers representing concepts. You can navigate and zoom the map just like a regular Google Map. Once you find an interesting concept, you can start exploring it by clicking on it. Alternatively, you can click <em>RAND</em> to explore a random concept. If you're not satisfied with the concept you are exploring, simply click <em>GLOBE</em> to return to <strong>Globe View</strong>.",
        "Concept Explorer switches to <strong>Browse View</strong> once a starting concept has been selected. In <strong>Browse View</strong>, the map zooms in and shows the selected concept in the center of the screen, surrounded by eight closely related concepts. You can click on any of these surrounding concepts to make it the new center concept. Alternatively, you can click on the center concept to switch to <strong>Details View</strong> that contains more information about the concept.",
        "<strong>Details View</strong> is a popup window that provides a summary of the concept, a link to the corresponding Wikipedia article for further exploration, and a score ranging from 0 to 100, indicating how concrete versus abstract the concept is. This score is also displayed in the middle of the marker in <strong>Browse View</strong>.",
        "In addition to <em>GLOBE</em> and <em>RAND</em> buttons explained earlier, the bottom panel includes <em>HOME</em>, <em>BACK</em>, and <em>ROUTE</em> buttons.These buttons are active only in <strong>Browse View</strong>, allowing you to return to the starting concept, take one step back on your browsing path, or view the entire route you have been browsing since the starting concept. Happy Exploring!"
    ];

  


    const clickInfo = (event) => { // show introscreen
        if (event.target.closest('.prevbutton') || event.target.closest('.nextbutton') || event.target.closest('.xbutton')) {
            // Prevent the event from propagating further
            return;
        }
        if ((expanded && !showText) || closing) { // do not allow action when opening or closing animation is on
            return
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
            setClosing(true)
            setTimeout(() => {
                setClosing(false)
            }, 500);
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
        <div className='InstructionBlock' > 
            <div className='InstructionBlockTitle' onClick={clickInfo}>
                <Typography className='InstructionBlockTitleText' variant="h4">
                Concept Explorer              
                </Typography>
                <img className='ExpandButton' src={xbuttonImage} onClick={() => maxMin()} alt="Close" /> 
            </div>
            
            <div className={`InstructionBlockText ${expanded ? 'expanded' : ''}`} onClick={clickInfo}>
                {showText &&  (
                    <>        
                        <Typography className='InstructionBlockHeader' variant="h4">
                            Instructions
                        </Typography>
                        <Typography className='InstructionBlock_Text' variant="h6" style={{ whiteSpace: 'pre-line' }}>
                            <div dangerouslySetInnerHTML={{ __html: instructionsText[introCounter] }} />
                        </Typography> 
                        <Typography className='InstructionCounter' variant="h4">
                            {introCounter + 1} / {instructionsText.length}
                        </Typography>
                        <img className={`prevbutton ${prevButtonDisabled}`} src={prevbuttonImage} onClick={() => prevButtonDisabled === '' ? takeStep(-1) : ''} alt="Previous" />
                        <img className={`nextbutton ${nextButtonDisabled}`} src={nextbuttonImage} onClick={() => nextButtonDisabled === '' ? takeStep(1) : ''} alt="Next" />                  

                    </>                              
                )}          
                </div>
            
        </div>
    );
};

export default InstructionBlock;

 