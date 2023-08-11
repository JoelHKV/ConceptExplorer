
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Typography } from '@mui/material';
import './OverlayBlock.css';
 
import { newGameMode } from '../reducers/quizGameSlice';

const OverlayBlock = ({ title, text }) => {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        // Set the component as expanded after it has mounted
        setExpanded(true);
        setTimeout(() => {
            setShowText(true)
        }, 500);
    }, []);

    const clickInfo = () => { // show introscreen
        setShowText(false)
        setExpanded(false)

        setTimeout(() => {
            dispatch(newGameMode('browse'))
        }, 400);

        
    }

    const openWikipediaInNewTab = () => {
        window.open('https://en.wikipedia.org/wiki/' + title, '_blank');
    };


    return (
        <div className={`OverlayBlock ${expanded ? 'expanded' : ''}`}
        onClick={clickInfo}
        >
            <Typography className='OverlayBlock_Title' variant="h4">
                {title}
            </Typography>

            {showText && (
                <>
            <Typography className='OverlayBlock_Text' variant="h6">
                {text}
            </Typography>
                    <Button variant="contained" onClick={openWikipediaInNewTab}>
                        Open Wikipedia in New Tab
                    </Button>
            
            <Button
                variant="contained"                
            >
                X
                    </Button> 
                </>
            )}
        </div>
    );
};

export default OverlayBlock;