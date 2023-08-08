import React from 'react';
import { Button, Typography } from '@mui/material';
import './EightButtonRow.css';


const EightButtonRow = ({ concepts, thisConcept, conceptData, buttonFunction, conceptRank }) => {

    const buttonNames = [...conceptData['concepts'], ...conceptData['related']];

    
    const abstractScore = `Abstract Score: ${conceptData['abstract'].toFixed(1)}`;


    const button8 = [
        thisConcept,
        ...buttonNames
        .map((button) => {
            let importanceValue = 100 * conceptRank[button]['iskey'] + conceptRank[button]['count'];
            return { button, importanceValue };
        })
        .sort((a, b) => b.importanceValue - a.importanceValue)
        .slice(0, 8)
        .map((item) => item.button)
    ];
    const angleIncrement = (2 * Math.PI) / button8.length; // Calculate angle increment


    const buttons = button8.map((button, index) => {
        console.log(conceptRank[button]['iskey'])
        const buttonClass = `concept-btn-${index} clickable-${conceptRank[button]['iskey']}`; // Define a const for the class name
        const angle = angleIncrement * index; // Calculate angle for each button
        let radius = 40
        if (index == 0) {
            radius = 0;
        }
         
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
            <Typography variant="body1" className="AbstractScore">

                {abstractScore }
            </Typography>

            {buttons}
        </div>
    );
};

export default EightButtonRow;