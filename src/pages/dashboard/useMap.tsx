import { useEffect, useRef, useState } from 'react';
import { Map } from 'mapbox-gl';
import { initMap } from './initMap';
import { generateNewMarker } from './generateNewMarker';
export const useMap = (container: React.RefObject<HTMLDivElement>, mapStyle: string, handleLongtitude: (num: number) => void,handleLatitude: (num: number) => void) => {

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
                    handleLongtitude(lngLat.lng);
                    handleLatitude(lngLat.lat);
                }

            )


            return () => {
                mapInitRef.current?.off('dblclick', generateNewMarker)
            }
        }

    }, [])

}