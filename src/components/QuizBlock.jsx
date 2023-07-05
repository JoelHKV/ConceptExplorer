import React from 'react';
import Button from '@mui/material/Button';

const QuizBlock = ({ handleModeChange, playmode }) => {

    const styles = `

    
    .practice-quiz, .quiz-quiz {
       display: grid;
        width: 100%;
        grid-column: 2 / 6;
        grid-row: 2;
        margin: auto;
        padding-top: 5vh;
      
    }
    .quiz-quiz {
        grid-column: 7 / 11;
    }
    
    .practice-quiz button, .quiz-quiz button  {
        background-color: #aaffff;
        color: black;
        border: 0.1rem solid black;
        width: 100%;
        height: 50%;
        margin-left: 6.7%;
        font-size: 1rem;
    }
 
  `;

    return (
        <>
            <div className="practice-quiz">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleModeChange('practice')}
                >
                    Practice
                </Button>
                </div>
            <div className="quiz-quiz">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleModeChange('quiz')}
                >
                    {playmode === 'finish' ? 'New Quiz' : 'Quiz'} 
                </Button>
            </div>
            <style>{styles}</style>
        </>
    );
};

export default QuizBlock;