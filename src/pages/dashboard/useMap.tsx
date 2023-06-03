import { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { LngLat, Map, Marker, } from 'mapbox-gl';
import { initMap } from './initMap';
import { generateNewMarker } from './generateNewMarker';
import { addMarkers } from './addMarkers';
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
import { assert } from 'console';
import assets from '../../assets';
import { randomInt } from 'crypto';
import { store } from '../../redux/store';


export const useMap = (container: React.RefObject<HTMLDivElement>, name: string, description: string, latitude: string,
    longtitude: string, addFlag: boolean, editFlag: boolean, dataLayerFlag: boolean, mapStyle: string, handleLongtitude: (num: number) => void,
    handleLatitude: (num: number) => void, handleName: (name: string) => void, handleDescription: (des: string) => void, deleteData: (pointName: string) => void,
    editData: (pointName: string, data: any) => void, geoStyleName: string, layerName: string, currentLayerName: string, array: any, geodata: any, allGeodata: any, drawMode: string, toggle: boolean,
    deleteFlag: boolean) => {


    const mapInitRef = useRef<Map | null>(null);

    const [markersArray, setMarkersArray] = useState<Marker[]>([]);
    const [currentMarker, setCurrentMarker] = useState<Marker>();
    const [currentBlueMaker, setCurrentBlueMaker] = useState<Marker>();
    const [currentLayerMarker, setCurrentLayerMarker] = useState<Marker>();

    const [currentMakerName, setCurrentMakerName] = useState<string>()
    const [currentMakerDescription, setCurrentMakerDescription] = useState<string>()

    const [lnglat, setLnglat] = useState<LngLat>()

    const [rect, setRect] = useState(false);
    const [circle, setCircle] = useState(false);
    const [polygon, setPolygon] = useState(false);

    const handleBlueMaker = (maker: Marker, pointName: string, description: string) => {
        setCurrentBlueMaker(maker);
        setCurrentMakerName(pointName);
        setCurrentMakerDescription(description);
    }

    const handleLayerMarker = (marker: Marker) => {
        setCurrentLayerMarker(marker);
    }



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
                        name: '',
                        description: '',
                        map: mapInitRef.current!,
                        ...lngLat,
                        color: "#63df29",
                        draggable: true,
                        setBlueMaker: handleBlueMaker
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
            if (currentBlueMaker) {
                handleLongtitude(currentBlueMaker?.getLngLat().lng);
                handleLatitude(currentBlueMaker?.getLngLat().lat);
                handleName(currentMakerName as string);
                handleDescription(currentMakerDescription as string);
            }
        }
    }, [currentBlueMaker]);

    useEffect(() => {
        if (container.current) {
        }

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
                name: name,
                description: description,
                map: mapInitRef.current!,
                ...v,
                color: "rgb(70, 104, 242)",
                draggable: false,
                setBlueMaker: handleBlueMaker
            });
        }
    }, [addFlag]);

    useEffect(() => {
        if (container.current) {

            // currentBlueMaker?.setLngLat([Number(longtitude), Number(latitude)]);
            currentBlueMaker?.remove()
            const v = new LngLat(Number(longtitude), Number(latitude))
            generateNewMarker({
                name: name,
                description: description,
                map: mapInitRef.current!,
                ...v,
                color: "rgb(70, 104, 242)",
                draggable: false,
                setBlueMaker: handleBlueMaker
            });
            editData(currentMakerName as string, { description, name, latitude, longtitude })
            setCurrentMakerName(name);
        }
    }, [editFlag]);

    useEffect(() => {
        if (container.current) {
            currentMarker?.remove();
            currentBlueMaker?.remove();
            deleteData(currentMakerName as string);
        }
    }, [deleteFlag]);
    useEffect(() => {
        if (container.current) {
            for (let i = 0; i < array.length; i++) {

                const v = new LngLat(Number(array[i]?.lng), Number(array[i]?.lat))
                const marker = generateNewMarker({
                    name: array[i]?.name,
                    description: array[i]?.description,
                    map: mapInitRef.current!,
                    ...v,
                    color: "rgb(70, 104, 242)",
                    draggable: false,
                    setBlueMaker: handleBlueMaker
                });
                // setMarkersArray(prevNames => [...prevNames, marker])
            }
        }
    }, [array]);

    useEffect(() => {


        if (geodata) {
            // buildLocationList(geodata);
            addMarkers(geodata, mapInitRef.current!, handleLayerMarker);

            const layerImage = [assets.images.blueMarker, assets.images.grayMarker, assets.images.greenMarker, assets.images.orangeMarker,
            assets.images.pinkMarker, assets.images.purpleMarker, assets.images.redMarker, assets.images.yellowMarker]
            const randomNum = Math.floor(Math.random() * 7);
            mapInitRef.current?.loadImage(
                layerImage[randomNum],
                (error: any, image: any) => {
                    if (error) throw error;
                    mapInitRef.current?.addImage(layerName, image);
                    // Add a GeoJSON source with 2 points
                    mapInitRef.current?.addSource(layerName, {
                        'type': 'geojson',
                        'data': geodata
                    });
                    // Add a symbol layer

                    mapInitRef.current?.addLayer({
                        'id': layerName,
                        'type': 'symbol',
                        'source': layerName,
                        'layout': {
                            'icon-image': '',
                            // get the title name from the source's "title" property
                            // 'text-field': ['get', 'name'],
                            'text-font': [
                                'Open Sans Semibold',
                                'Arial Unicode MS Bold'
                            ],
                            'text-offset': [0, 1.25],
                            'text-anchor': 'top'
                        }
                    });
                }
            );

        }
    }, [dataLayerFlag]);

    useEffect(() => {
        if (container.current) {
            allGeodata.map((data : any, index : any) => {
                if (data.name === currentLayerName) {
                    console.log(data.data)
                    mapInitRef.current!.flyTo({
                        center: data.data.features[0].geometry.coordinates,
                        zoom: 16
                    });
                }
            });
        }
    }, [currentLayerName]);

    useEffect(() => {
        if (container.current) {
            mapInitRef.current?.setStyle(geoStyleName);
        }
    }, [geoStyleName]);

    function buildLocationList(stores: any) {
        const array = stores.features.map((i: any, index: number) => {
            i.properties.id = index;
        });
    }

}