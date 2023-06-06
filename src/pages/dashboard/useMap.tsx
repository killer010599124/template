import { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from "react-dom";
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
    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))

    const [markersArray, setMarkersArray] = useState<Marker[]>([]);
    const [currentMarker, setCurrentMarker] = useState<Marker>();
    const [currentBlueMaker, setCurrentBlueMaker] = useState<Marker>();
    const [currentLayerMarker, setCurrentLayerMarker] = useState<Marker>();
    const [currentLayerGeoData, setCurrentLayerGeoData] = useState<any>();


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
        return () => mapInitRef.current?.remove()
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
            addMarkers(geodata, mapInitRef.current!, handleLayerMarker, updateMarkerCoordinates);
            mapInitRef.current?.flyTo({
                center: geodata.features[0].geometry.coordinates,
                zoom: 16
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
                setTimeout(() => {
                    // console.log(document.getElementsByClassName('mapboxgl-popup-content')[0]);

                    const cheader = Object.keys(currentLayerGeoData.features[0].properties);

                    // for (let i = 0; i < cheader.length; i++) {
                    //     (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).value = (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).getAttribute('value') as string;

                    // }

                    document.getElementsByClassName('deletemarker')[0].addEventListener('click', deleteMarker);

                    document.getElementsByClassName('savemarker')[0].addEventListener('click', editMarker);
                    document.getElementsByClassName('cancelmarker')[0].addEventListener('click', cancelMarker);
                }, 100)

                // document.getElementsByClassName('deletemarker')[0].addEventListener('click', (e) => { alert('hello') })
            }
        }
    }, [currentLayerMarker])

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
    function updateMarkerCoordinates(coord: any) {
        (document.getElementsByClassName('latitude')[0] as HTMLInputElement).value = coord.lat;
        (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).value = coord.lng;
    }
    function deleteMarker() {
        currentLayerMarker?.remove();
    }
    function editMarker() {
        const cheader = Object.keys(currentLayerGeoData.features[0].properties);

        for (let i = 0; i < cheader.length; i++) {

            (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).setAttribute('value', (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).value)
        }

        (document.getElementsByClassName('latitude')[0] as HTMLInputElement).setAttribute('value',(document.getElementsByClassName('latitude')[0] as HTMLInputElement).value);
        (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).setAttribute('value',(document.getElementsByClassName('longtitude')[0] as HTMLInputElement).value);
        const lng = Number((document.getElementsByClassName('longtitude')[0] as HTMLInputElement).getAttribute('value'));
        const lat =Number((document.getElementsByClassName('latitude')[0] as HTMLInputElement).getAttribute('value'))
        setTimeout(() => {
            console.log('edit')
            currentLayerMarker?.setLngLat([lng , lat ])
        }, 20);
       
        currentLayerMarker?.getPopup().remove()
    }
    function cancelMarker() {
        currentLayerMarker?.getPopup().remove()
    }
    const Popup = () => (
        <div className="popup">
            <h3 className="route-name">routeName</h3>
            <div className="route-metric-row">
                <h4 className="row-title">Route #</h4>
                <div className="row-value">routeNumber</div>
            </div>
            <div className="route-metric-row">
                <h4 className="row-title">Route Type</h4>
                <div className="row-value">type</div>
            </div>
            <p className="route-city">Serves city</p>
        </div>
    )

}