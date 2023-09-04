import { useEffect, useRef } from 'react';
import { useDispatch  } from 'react-redux';

import { newMapDimensions  } from '../reducers/conceptExplorerSlice';

export const measureGoogleMapDimensions = () => {

    const elementRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => {
            if (elementRef.current) {
                const width = elementRef.current.offsetWidth;
                const height = elementRef.current.offsetHeight;               
                dispatch(newMapDimensions({ width, height }))
            }
        };

        // Initial measurement
        handleResize();

        // Attach a window resize event listener to update the width
        window.addEventListener('resize', handleResize);

        // Cleanup: remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return { elementRef };
};

 