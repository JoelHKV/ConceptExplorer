import React from 'react';

const introText = []
//const imgurl = 'https://storage.googleapis.com/joeltestfiles/GG2.png'



const img1url = 'https://storage.googleapis.com/joeltestfiles/GGintro1.jpg'
const img2url = 'https://storage.googleapis.com/joeltestfiles/GGintro2.jpg'
const img3url = 'https://storage.googleapis.com/joeltestfiles/GGintro3.jpg'

introText[0] = `Gallery Galore is a collection of AI-generated paintings that 
help you associate famous painters with their distinct painting styles. 
For example, the title below is "Beyond the Horizon" by Salvador Dali.`;

introText[1] = `In the practice mode, you can browse through random 
paintings by clicking on the current painting. Alternatively,
you can change the title with the bottom slider and the painter with the right slider.`;

introText[2] = `In the quiz mode, you will be presented with random paintings, 
and your task is to guess the painter's name. Simply click the button that corresponds to 
the painting shown. Click on "PRACTICE" or "QUIZ" to start!`;



const IntroBlock = ({ nextIntro, gameMode, roundNro, imgurl }) => {

    const styles = `
    .intro-text{
        text-align: left;
        padding: 10px;
        margin-top: -1.2rem;
        font-size: 1.2rem;
    }
   
    .intro-image {
        height: 60%; 
        margin-left: auto;
        margin-right: auto;
        margin-top: -0.4rem;
        aspect-ratio: 1;
        border: 5px solid black;
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
                    src={roundNro === 0 ? img1url : roundNro === 1 ? img2url : img3url }
                    alt="Image"
                />
            </div>
 
            <style>{styles}</style>
        </>
    );
};

export default IntroBlock;