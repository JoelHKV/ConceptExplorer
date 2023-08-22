import React from 'react';
import { Button } from '@mui/material';
import './ModeButtonRow.css';

const buttonData = [
    {
        name: 'home',
        className: 'fly-control',
        param: 'home',
    },
    {
        name: 'back',
        className: 'fly-control',
        param: 'back',
    },
    {
        name: 'route',
        className: 'fly-control',
        param: 'route',
    },
    {
        name: 'globe',
        className: 'fly-control',
        param: 'globe',
    },
    {
        name: 'random',
        className: 'fly-control',
        param: 'random',
    },
  

];

const ModeButtonRow = ({ buttonFunction, enabled }) => {
   // const disabledClass = enabled ? '' : 'mode-button-disabled';
   // console.log(disabledClass)
    //const disabledClass = 'mode-button-disabled'
    const buttons = buttonData.map((button, index) => (
        <div key={index} className={`${button.className} ${enabled[index] ? '' : 'mode-button-disabled'}`}>
            <Button variant="contained" onClick={() => buttonFunction(button.param)}>
                {button.name}
            </Button>
        </div>
    ));

    return (
        <div className="ModeButtonRow centerContent">
            {buttons}
        </div>
    );
};

export default ModeButtonRow;