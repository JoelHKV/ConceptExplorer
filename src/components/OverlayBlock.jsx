
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, LinearProgress } from '@mui/material';
import './OverlayBlock.css';


import BarGraphBlock from '../components/BarGraphBlock';

import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';

import { getConceptDetails } from '../hooks/getConceptDetails';

import { newGameMode } from '../reducers/conceptExplorerSlice';




const OverlayBlock = ({ cloudFunctionURL, abstractValue, computeHalt } ) => {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);
    const dispatch = useDispatch();
 
    const markerState = useSelector((state) => state.counter[0].markerState);

    const title = markerState['Marker0'].param 
    const lat = markerState['Marker0'].lat
    const lng = markerState['Marker0'].lng

    const { conceptDetails, loaded, error } = getConceptDetails(cloudFunctionURL, title);

    const latitudeText = lat >= 0 ? 'N' : 'S';
    const longitudeText = lng >= 0 ? 'E' : 'W';
    const latLngWholeText = `${Math.abs(lat).toFixed(2)} ${latitudeText}, ${Math.abs(lng).toFixed(2)} ${longitudeText}`;

    

    useEffect(() => {
        computeHalt(1000)
        setExpanded(true);
        setTimeout(() => {
            setShowText(true)
        }, 500);
        return () => {
          //  dispatch(newGameMode('browse'))
            computeHalt(0)
        }
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
            <Typography className='OverlayBlockTitle' variant="h4">
                {title}             
            </Typography>
            {showText && loaded && (
                <>
                    <Typography className='OverlayBlockSubTitle' variant="h6">             
                        {latLngWholeText}
                    </Typography>                 
                    <BarGraphBlock
                        value={abstractValue}
                    />

                    <Typography className='OverlayBlockText' variant="h6">
                        {conceptDetails['definition']}
                    </Typography>
                                 
                    <Typography className='OverlayBlockFoot' variant="h6">
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