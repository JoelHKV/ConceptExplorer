import React from 'react';

import { Button, Typography } from '@mui/material';
import './HeaderBlock.css';
import { useDispatch  } from 'react-redux';
//import { zeroCounter, newGameMode } from '../reducers/quizGameSlice';

const HeaderBlock = () => {

    const dispatch = useDispatch();

    const clickInfo = () => { // show introscreen
       // dispatch(zeroCounter())
       // dispatch(newGameMode('intro'))
    }

    return (
        <div className="HeaderBlock">
            <Typography variant="h4">
                Concept Explorer
            </Typography>
            <Button
                variant="contained"
                onClick={() => clickInfo()}
            >
                ?
            </Button>           
        </div>
    );
};

export default HeaderBlock;