import React from 'react';
import { Button } from '@mui/material';
import './EightButtonRow.css';

const buttonData = [
    {
        name: 'practice',
        className: 'practice-button',
        param: 'practice',
    },
    {
        name: 'quiz',
        className: 'quiz-button',
        param: 'quiz',
    },
];

const EightButtonRow = ({ buttonNames, buttonFunction }) => {
    const buttons = buttonData.map((button, index) => (
        <div key={index} className={`${button.className}`}>
            <Button variant="contained" onClick={() => buttonFunction(button.param)}>
                {button.name}
            </Button>
        </div>
    ));

    return (
        <div className="EightButtonRow centerContent">
            {buttons}
        </div>
    );
};

export default EightButtonRow;