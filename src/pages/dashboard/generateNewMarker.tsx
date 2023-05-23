import { Popup, Marker, Map } from 'mapbox-gl';

export const generateNewMarker = ({name, description, lat, lng, map, color, draggable }:
     {name : string, description:string, lng: number, lat: number, map: Map, color : string, draggable:boolean }) => {

    const popUp = new Popup({ closeButton: false, anchor: 'left', })
        .setHTML(`<div class="popup">${name} <br/>${description} </br> [${lng},  ${lat}]</div>`)
        // rgb(70, 104, 242)
    const marker = new Marker({ color: color, scale: 1.5 })
        .setDraggable(draggable)
        .setLngLat([lng, lat])
        .setPopup(popUp)
        .addTo(map);
        
    marker.getElement().addEventListener('click', (e) => {{
        
        // popUp.setHTML(`
        // <div class="popup">You click here: <br/>[${marker.getLngLat().lng},  ${marker.getLngLat().lat}]</div>
        // `)
        
    }}, false);
    return marker;
    // 
    // console.log(marker.getLngLat())
    // markerArray.push(marker);
    // console.log(markerArray[0].getLngLat())
}