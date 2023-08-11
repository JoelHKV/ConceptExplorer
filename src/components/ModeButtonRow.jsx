import React from 'react';
import { Button } from '@mui/material';
import './ModeButtonRow.css';

const buttonData = [
    {
        name: 'back',
        className: 'navigate-button',
        param: 'back',
    },
    {
        name: 'forward',
        className: 'navigate-button',
        param: 'forward',
    },
];

const ModeButtonRow = ({ buttonFunction }) => {
    const buttons = buttonData.map((button, index) => (
        <div key={index} className={`${button.className}`}>
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