
import React, { useState, useEffect } from 'react';
 
import './GoogleMapsApp.css';

 
const GoogleMapsApp = ({ map, setMap, mapData }) => {


    function createCircleDataURL(radiusList, diameter) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = diameter; // Set the desired width
        canvas.height = diameter; // Set the desired height

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.beginPath();

        for (let i = 0; i < 360; i++) {
            const angle = (i * Math.PI) / 180;
            const x = centerX + diameter / 2 * radiusList[i] * Math.cos(angle);
            const y = centerY + diameter / 2 * radiusList[i] * Math.sin(angle);

            ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.stroke();

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, diameter/2);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(0.2, "green");
        gradient.addColorStop(0.5, "yellow");
        gradient.addColorStop(1, "red");

        ctx.fillStyle = gradient;
        ctx.fill();

        const dataURI = canvas.toDataURL();
        console.log('here')
        console.log(dataURI)
        return dataURI;
    }












    
    useEffect(() => {
        // Load the Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://returnsecret-c2cjxe2frq-lz.a.run.app`;
        script.defer = true;
        script.async = true;
        window.initMap = initMap;
        document.head.appendChild(script);
    }, []);
    // Initialize the map
    const initMap = () => {
        const mapOptions = {
            center: { lat: mapData.lat, lng: mapData.lng }, // San Francisco coordinates
            zoom: mapData.zoom,
        };

        const mapElement = document.getElementById('map');
        const newMap = new window.google.maps.Map(mapElement, mapOptions);
        setMap(newMap); // Save the map instance in the state
        
        return 
    };

     

    if (map) {
        map.setCenter({ lat: mapData.lat, lng: mapData.lng });
        map.setZoom(mapData.zoom);

        const defaultLabelOptions = {
            text: ' ',
            color: 'black',
            fontSize: '14px',
            fontWeight: 'bold'
        };
        if (mapData.markers) {
            mapData.markers.forEach((markerData) => {
                const labelOptions = markerData.label // use specified label data if given, otherwise default
                    ? Object.assign({}, defaultLabelOptions, markerData.label)
                    : defaultLabelOptions;
                const marker = new window.google.maps.Marker({
                    position: { lat: markerData.lat, lng: markerData.lng },
                    map: map,

                    title: markerData.title,
                    label: labelOptions,
                });
                marker.addListener("click", () => {
                    alert(markerData.title);

                });
            })
        }
        if (mapData.customMarkers) {
            mapData.customMarkers.forEach((markerData) => {
                const radiusList = new Array(360).fill(1);
                const diameter = markerData.diameter;
                const circleDataURL = createCircleDataURL(radiusList, diameter);

                const markerImage = new google.maps.MarkerImage(
                    circleDataURL,
                    new google.maps.Size(diameter, diameter),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(diameter / 2, diameter / 2)
                );

                const labelOptions = {
                    text: 'dadada',
                    color: 'red',
                    fontSize: '34px',
                    fontWeight: 'bold'
                };


                const marker = new window.google.maps.Marker({
                    position: { lat: markerData.lat, lng: markerData.lng },
                    map: map,
                    icon: markerImage,
                    title: 'koira',
                    label: labelOptions,
                });

            })
        }



    }

    return (       
        <>
            {1==2 && (
                <img src={circleDataURL} alt="Circle Image" />
            )}
        <div id="map"  >
            </div> 
        </>
    );
     

     
};

export default GoogleMapsApp;