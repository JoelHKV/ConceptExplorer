import React from 'react';
import { Button, Grid } from '@mui/material';

const CustomButtonGroup = ({ buttonNames, buttonFunction, buttonClasses = [], rows = 1 }) => {
    const horizontalButtonNro = buttonNames.length / rows;

    const styles = `
        .array-buttons {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
        }

        .array-button {
          flex: 0 0 auto;
          width: 100%;
          height: clamp(50px, 6vh, 80px);
        }

        .array-button button {
          background-color: #eee;
          color: black;
          border: 0.1rem solid black;
          width: 92%;
          height: 60%;
          font-size: 1rem;
        }

        .array-button button:hover {
          background-color: #ccc; 
        }

        .button-group-break {
          margin-top: -8px;
        }
  `;

    const buttons = buttonNames.map((name, index) => (
        <Grid item key={index} xs={12 / horizontalButtonNro}>
            <div className={`array-button ${buttonClasses[index]}`}>
                <Button variant="contained" onClick={() => buttonFunction(name)}>
                    {name.length > 18 ? `${name.slice(0, 13)}...` : name}
                </Button>
            </div>
        </Grid>
    ));

    const buttons2D = [];
    for (let i = 0; i < buttons.length; i += horizontalButtonNro) {
        const subarray = buttons.slice(i, i + horizontalButtonNro);
        buttons2D.push(subarray);
    }

    return (
        <>
            <div className="array-buttons">
                {buttons2D.map((buttons, index) => (
                    <React.Fragment key={index}>
                        <Grid container>{buttons}</Grid>
                        {index !== buttons2D.length - 1 && <div className="button-group-break"></div>}
                    </React.Fragment>
                ))}
            </div>
            <style>{styles}</style>
        </>
    );
};

export default CustomButtonGroup;