import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { initMap } from './initMap';


type Props = {};

const StreetMap = (props: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef.current) {
            initMap(
                mapRef.current,
                [-100.31019063199852, 25.66901932031443],
                "mapbox://styles/mapbox/streets-v12"
            )
        }
    }, [])
  return (
    <div ref={mapRef} className='map' style = {{padding : "0px !important", height : "100%", width: "100%"}}/>
)
};

export default StreetMap;