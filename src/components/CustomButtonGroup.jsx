import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const CustomButtonGroup = ({ buttonNames, handleModeChange }) => {
    let numButtons = buttonNames.length;
    if (numButtons == 1) {
        numButtons = 2
    }
    const styles = `
    .array-buttons {
      display: flex;
      justify-content: space-between;
      width: 100%;

    }

    .array-button {
      flex: 0 0 auto;
      width: calc(200% / ${numButtons});
      height: clamp(50px, 6vh, 80px);
    }

    .array-button button {
      background-color: #aaffff;
      color: black;
      border: 0.1rem solid black;
      width: 90%;
      height: 50%;
      font-size: 1rem;
    }
  `;

    const buttons = buttonNames.map((name, index) => (
        <Grid item key={index} xs={12 / numButtons}>
            <div className="array-button">
                <Button variant="contained" onClick={() => handleModeChange(name)}>
                    {name}
                </Button>
            </div>
        </Grid>
    ));

    return (
        <>
            <div className="array-buttons">
                <Grid container>{buttons}</Grid>
            </div>
            <style>{styles}</style>
        </>
    );
};

export default CustomButtonGroup;
