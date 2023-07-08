import { useState, useRef, useEffect } from 'react';

// Custom hook to handle container width and resize events
export function useContainerWidth() {
    const [containerWidth, setContainerWidth] = useState(null);
    const appContainerRef = useRef(null);

    const handleResize = () => {
        if (appContainerRef.current) {
            const width = appContainerRef.current.getBoundingClientRect().width;
            setContainerWidth(width);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        handleResize();
    }, []);

    return { containerWidth, appContainerRef };
}
