
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';
const MyFavicon = () => {

    const faviconDataURL = useMemo(() => {
        return drawCanvasSizeReturnDataURL(100, ' ', 'C', [0.85, 0.45, 0.35], 20);
    }, []);

    
    return (
        <Helmet>
            <link
                rel="icon"
                type="image/png"
                href={faviconDataURL}
            />
        </Helmet>
    );
};

export default MyFavicon;