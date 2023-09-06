
import React from 'react';
import { Helmet } from 'react-helmet';

const MyFavicon = ({ dataURL }) => {
    return (
        <Helmet>
            <link
                rel="icon"
                type="image/png"
                href={dataURL}
            />
        </Helmet>
    );
};

export default MyFavicon;