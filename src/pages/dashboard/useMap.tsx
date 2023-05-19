import { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { LngLat, Map } from 'mapbox-gl';
import { initMap } from './initMap';
import { generateNewMarker } from './generateNewMarker';
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { SrvRecord } from 'dns';
import Geocoder from './Geocoder';



export const useMap = (container: React.RefObject<HTMLDivElement>, latitude: string, longtitude: string, flag: boolean, mapStyle: string, handleLongtitude: (num: number) => void, handleLatitude: (num: number) => void, geoStyleName: string, csvData: any) => {

    const mapInitRef = useRef<Map | null>(null);
    // Add the geocoder to the map
    // const Geocoder = new MapBoxGeocoder({
    //     // Initialize the geocoder
    //     accessToken: 'pk.eyJ1Ijoib2FrdHJlZWFuYWx5dGljcyIsImEiOiJjbGhvdWFzOHQxemYwM2ZzNmQxOW1xZXdtIn0.JPcZgPfkVUutq8t8Z_BaHg', // Set the access token
    //     // localGeocoder: coordinatesGeocoder,
    //     // localGeocoderOnly: true,
    //     // localGeocoder : coordinatesGeocoder,
    //     // externalGeocoder : coordinatesGeocoder,
    //     mapboxgl: mapboxgl, // Set the mapbox-gl instance
    //     marker: true, // Do not use the default marker style
    //     zoom: 19,
    //     // reverseGeocode: true,
    //     placeholder: 'Search locations',
    //     render: function (item : any) {
    //         // extract the item's maki icon or use a default
    //         const maki = item.properties.maki || 'marker';
    //         return `<div class='geocoder-dropdown-item'>
    //         <img class='geocoder-dropdown-icon' src='https://unpkg.com/@mapbox/maki@6.1.0/icons/${maki}-11.svg'>
    //         <span class='geocoder-dropdown-text'>
    //         ${item.text}
    //         </span>
    //         </div>`;
    //     },
    // });
    useEffect(() => {
        if (container.current) {

            mapInitRef.current = initMap(
                container.current,
                [-100.1319063199852, 25.17901932031443],
                mapStyle
            );
            mapInitRef.current.addControl(Geocoder);

            mapInitRef.current && mapInitRef.current.on(
                'load',
                () => generateNewMarker({
                    map: mapInitRef.current!,
                    ...mapInitRef.current!.getCenter()
                })
            );
            // return () => {
            //     mapInitRef.current?.off('load', generateNewMarker)
            // }


            mapInitRef.current && mapInitRef.current.on(
                'dblclick',
                ({ lngLat }) => {
                    generateNewMarker({
                        map: mapInitRef.current!,
                        ...lngLat
                    });
                    // mapInitRef.current?.setStyle("mapbox://styles/mapbox/streets-v12")
                    handleLongtitude(lngLat.lng);
                    handleLatitude(lngLat.lat);

                }
            )
            return () => {
                mapInitRef.current?.off('dblclick', generateNewMarker)
            }
        }

    }, []);

    useEffect(() => {
        if (container.current) {

            const v = new LngLat(Number(longtitude), Number(latitude))
            generateNewMarker({
                map: mapInitRef.current!,
                ...v
            });
            // alert(longtitude + latitude)
            // console.log(new LngLat(Number(longtitude), Number(latitude)));
            // console.log(mapInitRef.current!.getCenter())


        }
    }, [flag]);

    useEffect(() => {
        if (container.current) {
            for (let i = 0; i < csvData.length; i++) {
                console.log('cnt');
                const v = new LngLat(Number(csvData[i]?.lng), Number(csvData[i]?.lat))
                generateNewMarker({
                    map: mapInitRef.current!,
                    ...v
                });
            }
        }
    }, [csvData]);

    useEffect(() => {
        if (container.current) {
            mapInitRef.current?.setStyle(geoStyleName);

        }
    }, [geoStyleName]);

}