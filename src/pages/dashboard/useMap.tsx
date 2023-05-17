import { useEffect,forwardRef,useImperativeHandle , useRef, useState } from 'react';
import { LngLat, Map } from 'mapbox-gl';
import { initMap } from './initMap';
import { generateNewMarker } from './generateNewMarker';


export const useMap = (container: React.RefObject<HTMLDivElement>,latitude:string,longtitude:string,flag:boolean, mapStyle: string, handleLongtitude: (num: number) => void,handleLatitude: (num: number) => void, geoStyleName : string) => {

    const mapInitRef = useRef<Map | null>(null);


    useEffect(() => {
        if (container.current) {

            mapInitRef.current = initMap(
                container.current,
                [-100.31019063199852, 25.66901932031443],
                mapStyle
            );
            mapInitRef.current && mapInitRef.current.on(
                'load',
                () => generateNewMarker({
                    map: mapInitRef.current!,
                    ...mapInitRef.current!.getCenter()
                })
            )
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

    }, [])
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
         
            
    }}, [flag])
    useEffect(() => {
        if (container.current) {
             mapInitRef.current?.setStyle(geoStyleName);
            
    }}, [geoStyleName])

}