
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import './OverlayBlock.css';

 
import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';

import { getConceptDetails } from '../hooks/getConceptDetails';

import { newGameMode } from '../reducers/conceptExplorerSlice';

const OverlayBlock = ( ) => {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);
    const dispatch = useDispatch();


    const markerState = useSelector((state) => state.counter[0].markerState);

    const title = markerState['Marker0'].param
    const lat = markerState['Marker0'].lat
    const lng = markerState['Marker0'].lng

    const { conceptDetails, loaded, error } = getConceptDetails(title);

    const latitudeText = lat >= 0 ? 'N' : 'S';
    const longitudeText = lng >= 0 ? 'E' : 'W';
    const wholeText = `${Math.abs(lat).toFixed(2)} ${latitudeText}, ${Math.abs(lng).toFixed(2)} ${longitudeText}`;

    useEffect(() => {
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

     
    const xbuttonImage = drawCanvasSizeReturnDataURL(80, '', 'X', [0.9, 0.7, 0.6], 30)


    const openWikipediaInNewTab = () => {
        window.open('https://en.wikipedia.org/wiki/' + title, '_blank');
        return
    };


    return (
        <div className={`OverlayBlock ${expanded ? 'expanded' : ''}`} onClick={clickInfo}>
            <Typography className='OverlayBlock_Title' variant="h4">
                {title}
               
            </Typography>
            {showText && loaded && (
                <>
            <Typography className='OverlayBlock_Title' variant="h6">             
                {wholeText}
            </Typography>
            
               
            <Typography className='OverlayBlock_Text' variant="h6">
                        {conceptDetails['definition']}
            </Typography>
                  
            
      
            <Typography className='OverlayBlock_Foot' variant="h6">
                        {conceptDetails['model'] + ' on ' + conceptDetails['date'].slice(5, -12)}
            </Typography>

                </>
            )} 
            <img className='xbutton' src={xbuttonImage} alt="Close" />
            <a href="https://en.wikipedia.org/wiki/Main_Page" target="_blank" rel="noopener noreferrer">
             <img className='wikilogo' src='https://ms.wikipedia.org/static/images/icons/wikipedia.png' alt="Wikipedia" onClick={openWikipediaInNewTab} />
            </a>

        </div>
    );
};

export default OverlayBlock;