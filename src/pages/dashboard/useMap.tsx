import { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { LngLat, Map } from 'mapbox-gl';
import { initMap } from './initMap';
import { generateNewMarker } from './generateNewMarker';
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import DrawControl from 'react-mapbox-gl-draw';
import { useControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { SrvRecord } from 'dns';
import Geocoder from './Geocoder';
// import drawGeoFence from './drawGeoFence';
import drawGeoFence from './drawGeoFence';
import drawCircle from './drawCircle';
import drawRect from './drawRect';
import { setAppState } from '../../redux/features/appStateSlice';


export const useMap = (container: React.RefObject<HTMLDivElement>, latitude: string,
    longtitude: string, flag: boolean, mapStyle: string, handleLongtitude: (num: number) => void,
    handleLatitude: (num: number) => void, geoStyleName: string, csvData: any, drawMode: string, toggle: boolean) => {

    const mapInitRef = useRef<Map | null>(null);
    const [rect, setRect] = useState(true);
    const [circle, setCircle] = useState(false);
    const [polygon, setPolygon] = useState(false);
    useEffect(() => {
        if (container.current) {

            mapInitRef.current = initMap(
                container.current,
                [-99.1319063199852, 25.17901932031443],
                mapStyle
            );
            mapInitRef.current.addControl(Geocoder);
            // mapInitRef.current.addControl(drawGeoFence);
            // mapInitRef.current.removeControl(drawGeoFence);
            // mapInitRef.current.addControl(drawCircle);
            // drawCircle.changeMode('draw_circle', { initialRadiusInKm: 0.5 });

            mapInitRef.current.addControl(drawRect);
            // drawRect.changeMode('draw_rectangle_drag');

            mapInitRef.current && mapInitRef.current.on(
                'load', () => {
                    generateNewMarker({
                        map: mapInitRef.current!,
                        ...mapInitRef.current!.getCenter()
                    });
                    // mapInitRef.current?.addControl(drawRect);
                    // drawRect.changeMode('draw_rectangle_drag');
                }


                // drawGeoFence.delete
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
                    // drawRect.changeMode('draw_rectangle_drag');
                }

            )
            return () => {
                mapInitRef.current?.off('dblclick', generateNewMarker)
            }
        }

    }, []);

    useEffect(() => {

        //   alert(drawMode);

        if (drawMode === "Circle") {
            // mapInitRef.current?.removeControl(drawRect)
            // mapInitRef.current?.removeControl(drawCircle);
            if (rect) {
                mapInitRef.current?.removeControl(drawRect);
                setRect(false);
            }
            if (circle) {
                mapInitRef.current?.removeControl(drawCircle);
                setCircle(false);
            }
            if(polygon){
                mapInitRef.current?.removeControl(drawGeoFence);
                setPolygon(false);
            }

           
            mapInitRef.current?.addControl(drawCircle);
            drawCircle.changeMode('draw_circle', { initialRadiusInKm: 0.5 });
            setCircle(true);
        }
        else if (drawMode === "RECT") {

            if (rect) {
                mapInitRef.current?.removeControl(drawRect);
                setRect(false);
            }
            if (circle) {

                mapInitRef.current?.removeControl(drawCircle);
                setCircle(false);
            }
            if(polygon){
                mapInitRef.current?.removeControl(drawGeoFence);
                setPolygon(false);
            }

            mapInitRef.current?.addControl(drawRect);
            drawRect.changeMode('draw_rectangle_drag');

            setRect(true);
        }
        else if (drawMode === "Polygon"){
            if (rect) {
                mapInitRef.current?.removeControl(drawRect);
                setRect(false);
            }
            if (circle) {

                mapInitRef.current?.removeControl(drawCircle);
                setCircle(false);
            }
            if(polygon){
                mapInitRef.current?.removeControl(drawGeoFence);
                setPolygon(false);
            }
            mapInitRef.current?.addControl(drawGeoFence);
            // drawRect.changeMode('draw_rectangle_drag');
            setPolygon(true);
        }
    }, [toggle]);

    useEffect(() => {
        if (container.current) {

            const v = new LngLat(Number(longtitude), Number(latitude))
            generateNewMarker({
                map: mapInitRef.current!,
                ...v
            });

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