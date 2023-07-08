import React from 'react';

import { Button } from '@mui/material';



const instructionsText = [
    "Gallery Galore is a collection of AI-generated paintings that help you associate famous painters with their distinct painting styles.",
    "In the practice mode, you can browse through random paintings by clicking on the current painting. Alternatively, you can change the title with the bottom slider and the painter with the right slider. You can try these options now.",
    "In the quiz mode, your task is to guess the painter's name. Who do you think is the author of this painting? Click one of the buttons below. Good luck!",
    "The border of the painting flashes green for the right answer and red for the wrong answer. Click on 'PRACTICE' or 'QUIZ' to start!"
];



const IntroBlock = ({ nextIntro, roundNro }) => {

    const styles = `
    .intro-info-text {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 70%;
        text-align: left;
        padding-left: 5%;
        padding-right: 5%;
        font-size: clamp(15px, 3.5vw, 30px);
        background-color: white;
        color: black;
        border: 0.3rem solid black;
    }
    .intro_button button {
        width: 100%;
        height: clamp(20px, 3.5vw, 35px);
        margin-bottom: 10px;
        font-size: 1rem;
        background-color: #eee;
        color: black;
        border: 0.1rem solid black;
    }

    .intro_button button:hover {
        background-color: #ccc;
    } 

  `;

    return (
        <>
            <div className="intro-info-text">
                <p>{instructionsText[roundNro]}</p>
                <div>
                    {(roundNro < 2) && (
                        <div className="intro_button">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={nextIntro}
                            >
                                read more
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <style>{styles}</style>
        </>
    );
};

export default IntroBlock;