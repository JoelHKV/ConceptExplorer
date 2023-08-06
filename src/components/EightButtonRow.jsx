import React from 'react';
import { Button } from '@mui/material';
import './EightButtonRow.css';


const EightButtonRow = ({ buttonNames, buttonFunction, conceptRank }) => {
    const angleIncrement = (2 * Math.PI) / buttonNames.length; // Calculate angle increment

    const buttons = buttonNames.map((button, index) => {
        console.log(conceptRank[button]['iskey'])
        const buttonClass = `concept-btn-${index} clickable-${conceptRank[button]['iskey']}`; // Define a const for the class name
        const angle = angleIncrement * index; // Calculate angle for each button
        const radius = 40; // Adjust the radius as needed
        const x = radius * Math.cos(angle) + 50; // Adjust the center coordinates (x)
        const y = radius * Math.sin(angle) + 50; // Adjust the center coordinates (y)

        const buttonStyle = {
            position: 'absolute',
            top: `${y}%`,
            left: `${x}%`,
        };
        return (
            <div key={index} className={buttonClass} style={buttonStyle}>
                <Button variant="contained" onClick={() => buttonFunction(button)}>
                    {button + ' ' + conceptRank[button]['count']}
                </Button>
            </div>
        );
    });
 






    return (
        <div className="EightButtonRow">
            {buttons}
        </div>
    );
};

export default EightButtonRow;