import { useEffect, useCallback, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from "react-dom";
import { LngLat, Map, Marker, } from 'mapbox-gl';
import { initMap } from './initMap';
import { generateNewMarker } from './generateNewMarker';
import { addMarkers } from './addMarkers';
import { generateOneMarker } from './createOneMarker';
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
import { render } from '@testing-library/react';


export const useMap = (container: React.RefObject<HTMLDivElement>, dataLayerFlag: boolean, addCurrentLayerData: (aData: any) => void,
    updateCurrentLayerData: (updateData: any) => void, deleteCurrentLayerData: (index: number) => void, geoStyleName: string, layerName: string,
    currentLayerName: string, currentMarkerData: any, geodata: any, allGeodata: any, drawMode: string, toggle: boolean,
    selectedMarkerImageFile: any, currentMarkerImage : any
) => {


    const mapInitRef = useRef<Map | null>(null);
    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
    const count = useRef<number>(0);


    const [currentLayerMarker, setCurrentLayerMarker] = useState<Marker>();
    const [currentLayerGeoData, setCurrentLayerGeoData] = useState<any>();
    const [currentData, setCurrentData] = useState<any>();

    const [rect, setRect] = useState(false);
    const [circle, setCircle] = useState(false);
    const [polygon, setPolygon] = useState(false);


    const handleLayerMarker = (marker: Marker) => {
        setCurrentLayerMarker(marker);
    }



    useEffect(() => {
        if (container.current) {

            mapInitRef.current = initMap(
                container.current,
                [-100.2419063199852, 25.17901932031443],
                "mapbox://styles/mapbox/satellite-streets-v12"
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



            // mapInitRef.current && mapInitRef.current.on("click", (e : any) => {
            //     const features = mapInitRef.current!.queryRenderedFeatures(e.point, {
            //         layers : [currentLayerName],
            //     })

            //     if (features.length > 0) {
            //         const feature = features[0];

            //         // const coordinates = e.features[0].geometry.coordinates;
            //         // console.log(coordinates)



            //         // create popup nod
            //         const popupNode = document.createElement("div")
            //         ReactDOM.render(
            //             <>
            //                 <div>{feature?.properties?.ID}</div>
            //             </>,
            //             popupNode
            //         )
            //         popUpRef.current
            //             .setLngLat(e.lngLat)
            //             .setDOMContent(popupNode)
            //             .addTo(mapInitRef.current!)
            //     }
            //     return () => {
            //         mapInitRef.current!.off('click', noti);
            //       }
            // })

            // mapInitRef.current && mapInitRef.current.on(
            //     'dblclick',
            //     ({ lngLat }) => {
            //         // markersArray[markersArray.length-1].remove();

            //         const marker = generateNewMarker({
            //             name: '',
            //             description: '',
            //             map: mapInitRef.current!,
            //             ...lngLat,
            //             color: "#63df29",
            //             draggable: true,
            //             setBlueMaker: handleBlueMaker
            //         });

            //         setCurrentMarker(marker);

            //         handleLongtitude(lngLat.lng);
            //         handleLatitude(lngLat.lat);
            //         setMarkersArray(prevNames => [...prevNames, marker])
            //     }
            // )

            // mapInitRef.current && mapInitRef.current.on(
            //     'dblclick',
            //     makeMarker
            // );

            // return () => {
            //     mapInitRef.current?.off('dblclick', makeMarker)
            // }
        }
        return () => mapInitRef.current?.remove()

    }, []);

    var temp = new Date().getTime();

    useEffect(() => {

        mapInitRef.current?.on('dblclick', makeMarker);

        return () => {
            mapInitRef.current?.off('dblclick', makeMarker);
        }

    }, [mapInitRef.current, currentLayerGeoData])

    const makeMarker = async (lngLat: any) => {

        const data: any = generateOneMarker(currentLayerGeoData, mapInitRef.current!, handleLayerMarker, updateMarkerCoordinates, returnMarkerData,currentMarkerImage, lngLat.lngLat);
        const feature =
        {
            type: 'Feature',
            geometry: data.geometry,
            properties: data.properties,
        };


        currentLayerGeoData.features.push(feature)

        buildLocationList(currentLayerGeoData);

        addCurrentLayerData(data);
    }



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


        if (geodata) {

            setCurrentLayerGeoData(geodata);
            addMarkers(geodata, mapInitRef.current!, handleLayerMarker, updateMarkerCoordinates, returnMarkerData, selectedMarkerImageFile );
            mapInitRef.current?.flyTo({
                center: geodata.features[0].geometry.coordinates,
                zoom: 20
            });
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
            allGeodata.map((data: any, index: any) => {
                if (data.name === currentLayerName) {

                    buildLocationList(data.data);
                    setCurrentLayerGeoData(data.data);
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
            if (currentLayerMarker) {

                if (mapInitRef.current?.getLayer('circles1')) mapInitRef.current?.removeLayer('circles1');

                // setTimeout(() => {

                //     const cheader = Object.keys(currentLayerGeoData.features[0].properties);

                //     document.getElementsByClassName('deletemarker')[0].addEventListener('click', deleteMarker);

                //     document.getElementsByClassName('savemarker')[0].addEventListener('click', editMarker);
                //     document.getElementsByClassName('cancelmarker')[0].addEventListener('click', cancelMarker);


                // }, 100)

                // document.getElementsByClassName('deletemarker')[0].addEventListener('click', (e) => { alert('hello') })
            }
        }
    }, [currentLayerMarker])

    var p = 0;
    useEffect(() => {
        if (currentMarkerData) {

            currentLayerGeoData.features.map((data: any, index: any) => {
                if (data.id === currentMarkerData.id) {
                    count.current = count.current + 1;

                    if (mapInitRef.current?.getLayer('circles1')) mapInitRef.current?.removeLayer('circles1');

                    mapInitRef.current?.addSource(`markers ${count.current}`, {

                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": [{
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": data.geometry.coordinates
                                },
                                "properties": {
                                    "modelId": 1,
                                },
                            },]
                        }
                    });

                    mapInitRef.current?.addLayer({
                        "id": "circles1",
                        "source": `markers ${count.current}`,
                        "type": "circle",
                        "paint": {
                            "circle-radius": 10,
                            "circle-color": "white",
                            "circle-opacity": 1,
                            "circle-stroke-width": 2,
                        },
                        "filter": ["==", "modelId", 1],
                    });

                    // if(mapInitRef.current?.getSource(`markers ${currentMarkerData.id}`)){
                    //     mapInitRef.current?.removeSource(`markers ${currentMarkerData.id}`);
                    //     console.log('delete source')
                    // }

                    mapInitRef.current?.flyTo({
                        center: data.geometry.coordinates,
                        zoom: 24
                    });
                }
            });
        }
    }, [currentMarkerData])

    useEffect(() => {
        if (currentData) {
            updateCurrentLayerData(currentData)
            setTimeout(() => {

                const cheader = Object.keys(currentLayerGeoData.features[0].properties);

                document.getElementsByClassName('deletemarker')[0].addEventListener('click', deleteMarker);

                document.getElementsByClassName('savemarker')[0].addEventListener('click', editMarker);
                document.getElementsByClassName('cancelmarker')[0].addEventListener('click', cancelMarker);


            }, 100)
            // console.log(currentData)
        }

    }, [currentData]);

    useEffect(() => {
        if (container.current) {
            mapInitRef.current?.setStyle(geoStyleName);
        }
    }, [geoStyleName]);

    function buildLocationList(stores: any) {
        const array = stores.features.map((i: any, index: number) => {
            i.id = index;
        });
    }

    function updateMarkerCoordinates(coord: any) {
        (document.getElementsByClassName('latitude')[0] as HTMLInputElement).value = coord.lat;
        (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).value = coord.lng;
    }

    function returnMarkerData(data: any) {
        setCurrentData(data);
    }

    function deleteMarker() {
        currentLayerMarker?.remove();
        const index: number =
            currentLayerGeoData.features.map((data: any, index: any) => {
                if (data.id === currentData.id) {
                    index = currentData.id;

                }
            });
        deleteCurrentLayerData(index);
        currentLayerGeoData.features.splice(index, 1);
        buildLocationList(currentLayerGeoData);

    }

    function editMarker() {
        const cheader = Object.keys(currentLayerGeoData.features[0].properties);


        for (let i = 0; i < cheader.length; i++) {
            (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).setAttribute('value', (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).value)
            currentData.data[cheader[i]] = (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).value;
        }

        updateCurrentLayerData(currentData);

        (document.getElementsByClassName('latitude')[0] as HTMLInputElement).setAttribute('value', (document.getElementsByClassName('latitude')[0] as HTMLInputElement).value);
        (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).setAttribute('value', (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).value);
        const lng = Number((document.getElementsByClassName('longtitude')[0] as HTMLInputElement).getAttribute('value'));
        const lat = Number((document.getElementsByClassName('latitude')[0] as HTMLInputElement).getAttribute('value'));

        currentLayerGeoData.features.map((data: any, index: any) => {
            if (data.id === currentData.id) {
                data.geometry.coordinates = [lng, lat];

                // mapInitRef.current?.flyTo({
                //     center: data.geometry.coordinates,
                //     zoom: 24
                // });
            }
        });

        setTimeout(() => {
            currentLayerMarker?.setLngLat([lng, lat]);
            mapInitRef.current?.flyTo({
                center: currentLayerMarker?.getLngLat(),
                zoom: 24
            });
            console.log(currentData)
        }, 30);
        currentLayerMarker?.getPopup().remove()
    }
    function cancelMarker() {
        currentLayerMarker?.getPopup().remove()
    }

}