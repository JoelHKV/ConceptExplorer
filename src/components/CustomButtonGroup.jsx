import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


const CustomButtonGroup = ({ buttonNames, buttonFunction, buttonClasses = [], rows = 1 }) => {
    let horizontalButtonNro = buttonNames.length/rows;
    console.log(rows)
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
          background-color: #aaffff;
          color: black;
          border: 0.1rem solid black;
          width: 80%;
          height: 50%;
          font-size: 1rem;
        }
       .button-group-break {
          margin-top: -10px;  
        }

   `;

    const buttons = buttonNames.map((name, index) => (
        <Grid item key={index} xs={12 / horizontalButtonNro}>
            <div className={`array-button ${buttonClasses[index]}`}>
                <Button variant="contained" onClick={() => buttonFunction(name)}>                                 
                    {name}
                </Button>
            </div>
        </Grid>
    ));

    const buttons2D = [];
    for (let i = 0; i < buttons.length; i += horizontalButtonNro) {
        const subarray = buttons.slice(i, i + horizontalButtonNro);
        buttons2D.push(subarray);
    }

    console.log(buttons2D)
    return (
        <>
            <div className="array-buttons">
                {buttons2D.map((buttons, index) => (
                    <React.Fragment key={index}>
                        <Grid container>{buttons}</Grid>
                        {index !== buttons2D.length - 1 && (
                            <div className="button-group-break"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <style>{styles}</style>
        </>
    );
};

export default CustomButtonGroup;
