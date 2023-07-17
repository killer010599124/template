import {
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { LngLat, Map, Marker } from "mapbox-gl";
import { initMap } from "./initMap";
import { generateNewMarker } from "./generateNewMarker";
import { addMarkers } from "./addMarkers";
import { generateOneMarker } from "./createOneMarker";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import DrawControl from "react-mapbox-gl-draw";
import { useControl } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { SrvRecord } from "dns";
import Geocoder from "./Geocoder";
// import drawGeoFence from './drawGeoFence';
import drawGeoFence from "./drawGeoFence";
import drawCircle from "./drawCircle";
import drawRect from "./drawRect";
import { setAppState } from "../../redux/features/appStateSlice";
import { assert } from "console";
import assets from "../../assets";
import { randomInt } from "crypto";
import { store } from "../../redux/store";
import { render } from "@testing-library/react";
import { Popup } from "mapbox-gl";
export const useMap = (
  container: React.RefObject<HTMLDivElement>,
  dataLayerFlag: boolean,
  initFlag: boolean,
  addCurrentLayerData: (aData: any) => void,
  updateCurrentLayerData: (updateData: any) => void,
  deleteCurrentLayerData: (index: number) => void,
  geoStyleName: string,
  layerName: string,
  currentLayerName: string,
  currentMarkerData: any,
  geodata: any,
  allGeodata: any,
  drawMode: string,
  toggle: boolean,
  selectedMarkerImageFile: any,
  currentMarkerImage: any
) => {
  const mapInitRef = useRef<Map | null>(null);
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));
  const count = useRef<number>(0);

  const [currentLayerMarker, setCurrentLayerMarker] = useState<Marker>();
  const [currentLayerGeoData, setCurrentLayerGeoData] = useState<any>();
  const [currentData, setCurrentData] = useState<any>();

  const [rect, setRect] = useState(false);
  const [circle, setCircle] = useState(false);
  const [polygon, setPolygon] = useState(false);

  const handleLayerMarker = (marker: Marker) => {
    setCurrentLayerMarker(marker);
  };

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
    return () => mapInitRef.current?.remove();
  }, []);

  const popUp = new Popup({ closeButton: false, anchor: "left" });

  useEffect(() => {
    mapInitRef.current?.on("dblclick", makeMarker);

    return () => {
      mapInitRef.current?.off("dblclick", makeMarker);
    };
  }, [mapInitRef.current, currentLayerGeoData]);

  const makeMarker = async (lngLat: any) => {
    const data: any = generateOneMarker(
      currentLayerGeoData,
      mapInitRef.current!,
      handleLayerMarker,
      updateMarkerCoordinates,
      returnMarkerData,
      currentMarkerImage,
      lngLat.lngLat,
      currentLayerName
    );
    const feature = {
      type: "Feature",
      geometry: data.geometry,
      properties: data.properties,
    };

    currentLayerGeoData.features.push(feature);
    // addMarkers(currentLayerGeoData, mapInitRef.current!, handleLayerMarker, updateMarkerCoordinates, returnMarkerData, currentMarkerImage, currentLayerName);

    // currentLayerGeoData.features.push(feature)

    buildLocationList(currentLayerGeoData);
    addCurrentLayerData(data);
  };

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
      drawCircle.changeMode("draw_circle", { initialRadiusInKm: 5 });
      setCircle(true);
    } else if (drawMode === "RECT") {
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
      drawRect.changeMode("draw_rectangle_drag");

      setRect(true);
    } else if (drawMode === "Polygon") {
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
      // addMarkers(geodata, mapInitRef.current!, handleLayerMarker, updateMarkerCoordinates, returnMarkerData, selectedMarkerImageFile, currentLayerName);
      mapInitRef.current?.flyTo({
        center: geodata.features[0].geometry.coordinates,
        zoom: 20,
      });

      mapInitRef.current?.addSource(layerName, {
        type: "geojson",
        data: geodata,
      });
      // Add a symbol layer

      mapInitRef.current?.addLayer({
        id: layerName,
        type: "circle",
        source: layerName,
        paint: {
          "circle-radius": 5,
          "circle-stroke-width": 2,
          "circle-color": "red",
          "circle-stroke-color": "white",
        },
        layout: {
          visibility: "visible",
          // 'icon-image': layerName,

          // 'text-font': [
          //     'Open Sans Semibold',
          //     'Arial Unicode MS Bold'
          // ],
          // 'text-offset': [0, 1.25],
          // 'text-anchor': 'top'
        },
      });
    }
  }, [dataLayerFlag]);

  useEffect(() => {
    if (allGeodata.length != 0) {
      console.log("init");
      console.log(allGeodata);
      setCurrentLayerGeoData(allGeodata[0].data);
      allGeodata.map((data: any, index: any) => {
        mapInitRef.current?.flyTo({
          center: data.data.features[0].geometry.coordinates,
          zoom: 20,
        });
        mapInitRef.current?.addSource(data.name, {
          type: "geojson",
          data: data.data,
        });
        // Add a symbol layer
        mapInitRef.current?.addLayer({
          id: data.name,
          type: "circle",
          source: data.name,
          paint: {
            "circle-radius": 5,
            "circle-stroke-width": 2,
            "circle-color": "red",
            "circle-stroke-color": "white",
          },
          layout: {
            visibility: "visible",
            // 'icon-image': layerName,
            // 'text-font': [
            //     'Open Sans Semibold',
            //     'Arial Unicode MS Bold'
            // ],
            // 'text-offset': [0, 1.25],
            // 'text-anchor': 'top'
          },
        });
      });
    }
  }, [initFlag]);
  useEffect(() => {
    if (container.current) {
      allGeodata.map((data: any, index: any) => {
        if (data.name === currentLayerName) {
          buildLocationList(data.data);
          setCurrentLayerGeoData(data.data);
          mapInitRef.current!.flyTo({
            center: data.data.features[0].geometry.coordinates,
            zoom: 16,
          });
        }
      });

      mapInitRef.current?.on("mouseenter", currentLayerName, (e: any) => {
        // Change the cursor style as a UI indicator.
        if (mapInitRef.current)
          mapInitRef.current.getCanvas().style.cursor = "pointer";

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const values = e.features[0].properties;
        const cheader = Object.keys(values);
        let html = "";
        // const values = i.properties;

        html += `<div style="background:black; color : white; opacity : 0.75; padding: 10px; border-radius: 10px;">`;
        const obj = cheader.reduce((object: any, header, index) => {
          html += `<div style="width:100%; display:flex">
                             <label for="name" style="width:40%; text-align:right; padding-right: 5px;" >${header} :</label>
                             <input type="text" value = "${values[header]}" style="width:60%; border: 0.01em solid white;" class = "${header}">
                         </div>
                         `;
          object[header] = values[header];
          return object;
        }, {});
        html += `<div style="width:100%; display:flex">
                             <label for="name" style="width:40%; text-align:right; padding-right: 5px;" >Latitude :</label>
                             <input type="text" value = "${coordinates[1]}" style="width:60%; border: 0.01em solid white;" class = "latitude">
                         </div>`;
        html += `<div style="width:100%; display:flex">
                         <label for="name" style="width:40%; text-align:right; padding-right: 5px;" >Longtitude :</label>
                         <input type="text" value = "${coordinates[0]}" style="width:60%; border: 0.01em solid white;" class = "longtitude">
                     </div>`;
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popUp.setLngLat(coordinates).setHTML(html).addTo(mapInitRef.current!);
      });

      mapInitRef.current?.on("mouseleave", currentLayerName, () => {
        if (mapInitRef.current)
          mapInitRef.current.getCanvas().style.cursor = "";
        popUp.remove();
      });
    }
  }, [currentLayerName]);
  useEffect(() => {
    mapInitRef.current?.on("style.load", () => {
      console.log("map style changed");
      console.log(currentLayerGeoData);
      if (currentLayerGeoData) {
        mapInitRef.current?.addSource(currentLayerName, {
          type: "geojson",
          data: currentLayerGeoData,
        });
        // Add a symbol layer

        mapInitRef.current?.addLayer({
          id: currentLayerName,
          type: "circle",
          source: currentLayerName,
          paint: {
            "circle-radius": 5,
            "circle-stroke-width": 2,
            "circle-color": "red",
            "circle-stroke-color": "white",
          },
          layout: {
            visibility: "visible",
            // 'icon-image': layerName,

            // 'text-font': [
            //     'Open Sans Semibold',
            //     'Arial Unicode MS Bold'
            // ],
            // 'text-offset': [0, 1.25],
            // 'text-anchor': 'top'
          },
        });
      }
    });
  }, [currentLayerGeoData]);
  useEffect(() => {
    if (container.current) {
      if (currentLayerMarker) {
        if (mapInitRef.current?.getLayer("circles1"))
          mapInitRef.current?.removeLayer("circles1");

        setTimeout(() => {
          const cheader = Object.keys(
            currentLayerGeoData.features[0].properties
          );

          document
            .getElementsByClassName("deletemarker")[0]
            .addEventListener("click", deleteMarker);

          document
            .getElementsByClassName("savemarker")[0]
            .addEventListener("click", editMarker);
          document
            .getElementsByClassName("cancelmarker")[0]
            .addEventListener("click", cancelMarker);
        }, 100);

        // document.getElementsByClassName('deletemarker')[0].addEventListener('click', (e) => { alert('hello') })
      }
    }
  }, [currentLayerMarker]);

  useEffect(() => {
    if (currentMarkerData) {
      currentLayerGeoData.features.map((data: any, index: any) => {
        if (data.id === currentMarkerData.id) {
          count.current = count.current + 1;

          if (mapInitRef.current?.getLayer("circles1"))
            mapInitRef.current?.removeLayer("circles1");

          mapInitRef.current?.addSource(`markers ${count.current}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: data.geometry.coordinates,
                  },
                  properties: {
                    modelId: 1,
                  },
                },
              ],
            },
          });

          mapInitRef.current?.addLayer({
            id: "circles1",
            source: `markers ${count.current}`,
            type: "circle",
            paint: {
              "circle-radius": 10,
              "circle-color": "white",
              "circle-opacity": 1,
              "circle-stroke-width": 2,
            },
            filter: ["==", "modelId", 1],
          });

          // if(mapInitRef.current?.getSource(`markers ${currentMarkerData.id}`)){
          //     mapInitRef.current?.removeSource(`markers ${currentMarkerData.id}`);
          //     console.log('delete source')
          // }

          mapInitRef.current?.flyTo({
            center: data.geometry.coordinates,
            zoom: 24,
          });
        }
      });
    }
  }, [currentMarkerData]);

  useEffect(() => {
    if (currentData) {
      updateCurrentLayerData(currentData);

      // console.log(currentData)
    }
  }, [currentData]);

  useEffect(() => {
    if (container.current) {
      console.log(layerName);
      mapInitRef.current?.setStyle(geoStyleName);
    }
  }, [geoStyleName]);

  function buildLocationList(stores: any) {
    const array = stores.features.map((i: any, index: number) => {
      i.id = index;
    });
  }

  function updateMarkerCoordinates(coord: any) {
    (document.getElementsByClassName("latitude")[0] as HTMLInputElement).value =
      coord.lat;
    (
      document.getElementsByClassName("longtitude")[0] as HTMLInputElement
    ).value = coord.lng;
  }

  function returnMarkerData(data: any) {
    setCurrentData(data);
  }

  function deleteMarker() {
    // currentLayerMarker?.remove();

    deleteElementsByClassName(`${currentLayerName}qwer`);

    let num: number = 0;

    console.log(currentLayerGeoData);

    currentLayerGeoData.features.map((data: any, index: any) => {
      console.log(data.id + ":" + currentData.id);
      if (data.id === currentData.id) {
        num = data.id;
      }
    });

    deleteCurrentLayerData(num);

    currentLayerGeoData.features.splice(num, 1);

    console.log(currentLayerGeoData);

    addMarkers(
      currentLayerGeoData,
      mapInitRef.current!,
      handleLayerMarker,
      updateMarkerCoordinates,
      returnMarkerData,
      currentMarkerImage,
      currentLayerName
    );

    buildLocationList(currentLayerGeoData);
  }
  function deleteElementsByClassName(className: string) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      element.remove();
    });
  }

  function editMarker() {
    const cheader = Object.keys(currentLayerGeoData.features[0].properties);

    for (let i = 0; i < cheader.length; i++) {
      (
        document.getElementsByClassName(cheader[i])[0] as HTMLInputElement
      ).setAttribute(
        "value",
        (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement)
          .value
      );
      currentData.data[cheader[i]] = (
        document.getElementsByClassName(cheader[i])[0] as HTMLInputElement
      ).value;
    }
    //---------------In Here save---------------//
    // const feature =
    // {
    //     type: 'Feature',
    //     geometry: data.geometry,
    //     properties: data.properties,
    // };
    // setCurrentLayerGeoData

    updateCurrentLayerData(currentData);

    (
      document.getElementsByClassName("latitude")[0] as HTMLInputElement
    ).setAttribute(
      "value",
      (document.getElementsByClassName("latitude")[0] as HTMLInputElement).value
    );
    (
      document.getElementsByClassName("longtitude")[0] as HTMLInputElement
    ).setAttribute(
      "value",
      (document.getElementsByClassName("longtitude")[0] as HTMLInputElement)
        .value
    );
    const lng = Number(
      (
        document.getElementsByClassName("longtitude")[0] as HTMLInputElement
      ).getAttribute("value")
    );
    const lat = Number(
      (
        document.getElementsByClassName("latitude")[0] as HTMLInputElement
      ).getAttribute("value")
    );

    currentLayerGeoData.features.map((data: any, index: any) => {
      if (data.id === currentData.id) {
        data.geometry.coordinates = [lng, lat];
        data.properties = currentData.data;
        console.log(data);
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
        zoom: 24,
      });
    }, 30);
    currentLayerMarker?.getPopup().remove();
  }
  function cancelMarker() {
    currentLayerMarker?.getPopup().remove();
  }
};
