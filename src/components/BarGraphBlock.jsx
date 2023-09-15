
import React from 'react';
import { Typography, LinearProgress } from '@mui/material';
import './BarGraphBlock.css';

const BarGraphBlock = ({ value }) => {

    const thresholdForHigh = 50;
    const numericalValueClassName = value >= thresholdForHigh ? 'bar-value bar-value-high' : 'bar-value bar-value-low'; 

    return (
        <div className="BarGraphBlock">
        <div className="bar-graph-container">
            <LinearProgress
                variant="determinate"
                value={value}
                className="progress-bar"
            />
            <Typography
                variant="body2"
                className="bar-graph-label concrete-label"
            >
                Concrete
            </Typography>
            <Typography
                variant="body2"
                className="bar-graph-label abstract-label"
            >
                Abstract
            </Typography>
            <Typography
                variant="body2"
                className={numericalValueClassName}
                style={{
                    left: `${value}%`, // Position the numerical value based on the bar's value
                }}
            >
                {value}
            </Typography>
            </div>
        </div>
    );
};

export default BarGraphBlock;
