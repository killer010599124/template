import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { initMap } from './initMap';
import { useMap } from './useMap';
type Props = {};

const LightMap = (props: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // useMap(mapRef,"mapbox://styles/mapbox/light-v11")
  
  return (
    <div ref={mapRef} className='map' style = {{padding : "0px", height : "100%", width: "100%"}}/>
)
};

export default LightMap;