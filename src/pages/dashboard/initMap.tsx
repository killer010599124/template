import { Map } from 'mapbox-gl';


export const initMap = (container: HTMLDivElement, coords: [number, number], mapStyle : string) => {
    
    return new Map({
        container,
        style: mapStyle,
        pitchWithRotate: false,
        center: coords,
        zoom: 15,
        accessToken: "pk.eyJ1Ijoib2FrdHJlZWFuYWx5dGljcyIsImEiOiJjbGhvdWFzOHQxemYwM2ZzNmQxOW1xZXdtIn0.JPcZgPfkVUutq8t8Z_BaHg",
        doubleClickZoom: false
    });
    
}