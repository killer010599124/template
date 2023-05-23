import { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { LngLat, Map, Marker, } from 'mapbox-gl';
import { initMap } from './initMap';
import { generateNewMarker } from './generateNewMarker';
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import DrawControl from 'react-mapbox-gl-draw';
import { useControl, } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { SrvRecord } from 'dns';
import Geocoder from './Geocoder';
// import drawGeoFence from './drawGeoFence';
import drawGeoFence from './drawGeoFence';
import drawCircle from './drawCircle';
import drawRect from './drawRect';
import { setAppState } from '../../redux/features/appStateSlice';


export const useMap = (container: React.RefObject<HTMLDivElement>,name:string, description:string, latitude: string,
    longtitude: string, flag: boolean, mapStyle: string, handleLongtitude: (num: number) => void,
    handleLatitude: (num: number) => void, geoStyleName: string, csvData: any, drawMode: string, toggle: boolean,
    deleteFlag: boolean) => {


    const mapInitRef = useRef<Map | null>(null);

    const [markersArray, setMarkersArray] = useState<Marker[]>([]);
    const [currentMarker, setCurrentMarker] = useState<Marker>();
    const [lnglat, setLnglat] = useState<LngLat>()

    const [rect, setRect] = useState(false);
    const [circle, setCircle] = useState(false);
    const [polygon, setPolygon] = useState(false);
    useEffect(() => {
        if (container.current) {

            mapInitRef.current = initMap(
                container.current,
                [-100.2419063199852, 25.17901932031443],
                mapStyle
            );
            mapInitRef.current.addControl(Geocoder);
            // mapInitRef.current.addControl(drawGeoFence);
            // mapInitRef.current.removeControl(drawGeoFence);
            // mapInitRef.current.addControl(drawCircle);
            // drawCircle.changeMode('draw_circle', { initialRadiusInKm: 0.5 });

            // mapInitRef.current.addControl(drawRect);
            // drawRect.changeMode('draw_rectangle_drag');

            // mapInitRef.current && mapInitRef.current.on(
            //     'load', () => {
            //         const marker = generateNewMarker({
            //             map: mapInitRef.current!,
            //             ...mapInitRef.current!.getCenter(),
            //             color: "#63df29",
            //             draggable: true
            //         });
            //         setMarkersArray(prevNames => [...prevNames, marker])
            //     }

            // );


            mapInitRef.current && mapInitRef.current.on(
                'dblclick',
                ({ lngLat }) => {
                    // markersArray[markersArray.length-1].remove();
                    const marker = generateNewMarker({
                        name:'',
                        description:'',
                        map: mapInitRef.current!,
                        ...lngLat,
                        color: "#63df29",
                        draggable: true
                    });

                    setCurrentMarker(marker);
                    
                    handleLongtitude(lngLat.lng);
                    handleLatitude(lngLat.lat);
                    setMarkersArray(prevNames => [...prevNames, marker])
                }
            )
            return () => {
                mapInitRef.current?.off('dblclick', generateNewMarker)
            }
        }

    }, []);

    useEffect(() => {
        if (container.current) {
            if (markersArray.length > 1) {
                const marker = markersArray[markersArray.length - 2];
                marker.remove()
            }

        }
    }, [currentMarker]);
    useEffect(() => {
        if (container.current) {
            console.log(lnglat);
        }
        console.log(lnglat);
    }, [lnglat]);

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
            if (polygon) {
                mapInitRef.current?.removeControl(drawGeoFence);
                setPolygon(false);
            }


            mapInitRef.current?.addControl(drawCircle);
            drawCircle.changeMode('draw_circle', { initialRadiusInKm: 5 });
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
            if (polygon) {
                mapInitRef.current?.removeControl(drawGeoFence);
                setPolygon(false);
            }

            mapInitRef.current?.addControl(drawRect);
            drawRect.changeMode('draw_rectangle_drag');

            setRect(true);
        }
        else if (drawMode === "Polygon") {
            if (rect) {
                mapInitRef.current?.removeControl(drawRect);
                setRect(false);
            }
            if (circle) {

                mapInitRef.current?.removeControl(drawCircle);
                setCircle(false);
            }
            if (polygon) {
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
                name : name,
                description : description,
                map: mapInitRef.current!,
                ...v,
                color: "rgb(70, 104, 242)",
                draggable: false
            });
        }
    }, [flag]);
    useEffect(() => {
        if (container.current) {
            currentMarker?.remove();
            console.log(currentMarker?.getLngLat());
        }

    }, [deleteFlag]);
    useEffect(() => {
        if (container.current) {
            for (let i = 0; i < csvData.length; i++) {
                console.log('cnt');
                const v = new LngLat(Number(csvData[i]?.lng), Number(csvData[i]?.lat))
                const marker = generateNewMarker({
                    name : csvData[i]?.name,
                    description : csvData[i]?.description,
                    map: mapInitRef.current!,
                    ...v,
                    color: "rgb(70, 104, 242)",
                    draggable: false
                });
                // setMarkersArray(prevNames => [...prevNames, marker])
            }
        }
    }, [csvData]);

    useEffect(() => {
        if (container.current) {
            mapInitRef.current?.setStyle(geoStyleName);
        }
    }, [geoStyleName]);

}