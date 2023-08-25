
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Typography } from '@mui/material';
import './OverlayBlock.css';


import { getConceptDetails } from '../hooks/getConceptDetails';

import { newGameMode } from '../reducers/conceptExplorerSlice';

const OverlayBlock = ({ title, text }) => {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);
    const dispatch = useDispatch();

  //  import wikipediaLogo from 'https://ms.wikipedia.org/static/images/icons/wikipedia.png'; // Replace with the actual path to the logo


    const { conceptDetails, loaded, error } = getConceptDetails(title);

 

    useEffect(() => {
        // Set the component as expanded after it has mounted
        setExpanded(true);
        setTimeout(() => {
            setShowText(true)
        }, 500);
    }, []);

    const clickInfo = (event) => { // show introscreen

        if (event.target.closest('.wikilogo')) {
            // Prevent the event from propagating further
            return;
        }

        setShowText(false)
        setExpanded(false)

        setTimeout(() => {
            dispatch(newGameMode('browse'))
        }, 400);

        
    }

    const openWikipediaInNewTab = () => {
        window.open('https://en.wikipedia.org/wiki/' + title, '_blank');
        return
    };


    return (
        <div className={`OverlayBlock ${expanded ? 'expanded' : ''}`} onClick={clickInfo}>
            <Typography className='OverlayBlock_Title' variant="h4">
                {title}
            </Typography>

            {showText && (
                <>
            <Typography className='OverlayBlock_Text' variant="h6">
                        {conceptDetails['definition']}
            </Typography>
                  
            
            <Button variant="contained" className='xButton'>
                X
            </Button> 
            <Typography className='OverlayBlock_Text' variant="h6">
                        {conceptDetails['model'] + ' on ' + conceptDetails['date'].slice(5, -12) }
            </Typography>

                </>
            )} 
            <a href="https://en.wikipedia.org/wiki/Main_Page" target="_blank" rel="noopener noreferrer">

             <img className='wikilogo' src='https://ms.wikipedia.org/static/images/icons/wikipedia.png' alt="Wikipedia" onClick={openWikipediaInNewTab} />
        </a>

        </div>
    );
};

export default OverlayBlock;