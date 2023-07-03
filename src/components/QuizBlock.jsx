import React from 'react';
import Button from '@mui/material/Button';

const QuizBlock = ({ handleModeChange, playmode }) => {
    return (
        <div className="practice-quiz">
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleModeChange('practice')}
            >
                Practice
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleModeChange('quiz')}
            >
                Quiz
            </Button>
        </div>
    );
};

export default QuizBlock;