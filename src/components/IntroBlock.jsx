import React from 'react';
import Button from '@mui/material/Button';


const introText = []
//const imgurl = 'https://storage.googleapis.com/joeltestfiles/GG2.png'

const img2url = 'https://storage.googleapis.com/joeltestfiles/intro2.png'
const img3url = 'https://storage.googleapis.com/joeltestfiles/intro3.png'

introText[0] = `Gallery Galore is a fun way to learn about the styles of the most famous painters. 
    The app contains a total of 200 AI-generated paintings, breaking into 20 different titles
    and 10 different painters.`;

introText[1] = `In the practice mode, you can view random paintings by clicking on the current painting. 
    Alternatively, you can use the bottom slider to change the title
    or the right slider to change the painter.`;

introText[2] = `In the quiz mode, you will be presented with four buttons, each 
    displaying a different painter's name. Your task is to click on the button that 
    corresponds to the painting shown.`;



const IntroBlock = ({ nextIntro, gameMode, roundNro, imgurl }) => {

    const styles = `
    .intro-text{
        text-align: left;
    }
   
    .intro-image {
        height: 80%; 
        margin-left: auto;
        margin-right: auto;
        aspect-ratio: 1;
    }

    .intro-image img {
          width: 100%;
          height: 100%;
          object-fit: cover; 
    }





    .intro-button button {
        background-color: #aaffff;
        color: black;
        border: 0.1rem solid black;
        width: 50%;   
        height: 5vh;
        font-size: 1rem;
    }

    
  `;

    return (
        <>
            <div className="intro-text">
                <p>{ introText[roundNro] }</p>
            </div>
            <div className="intro-image">
                <img 
                    src={roundNro === 0 ? imgurl : roundNro === 1 ? img2url : img3url }
                    alt="Image"
                />
            </div>
            <div className="intro-button">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => nextIntro()}
                >
                    {roundNro === 2 ? 'Practice' : 'Read on'} 
                </Button>
            </div>
            <style>{styles}</style>
        </>
    );
};

export default IntroBlock;