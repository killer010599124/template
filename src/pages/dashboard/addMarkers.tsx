import { Popup, Marker, Map } from 'mapbox-gl';

export const addMarkers = (geodata: any, map: Map, handleLayerMarker : (marker : Marker) => void) => {

    const layerImage = ['gray', 'red', 'blue', 'green', 'black', 'yello', 'pink', 'purple']
    const randomNum = Math.floor(Math.random() * 7);
    flyToStore(geodata.features[0]);
    const array = geodata.features.map((i: any, index: number) => {

        // let marker = new Marker;
        if (i) {
            const cheader = Object.keys(i.properties);
            let html = '';
            const values = i.properties;
            const obj = cheader.reduce((object: any, header, index) => {

                html += `<div>${header} : ${values[header]}</div>`
                // object[header] = values[header];
                // return object;
            }, {});
            html += `<button onclick = "alert('hello')"> delete </button>`

            const popUp = new Popup({ closeButton: false, anchor: 'left', })
                .setHTML(html);


            const marker = new Marker({ color: layerImage[randomNum], scale: 0.8 })
                .setDraggable(false)
                .setLngLat(i.geometry.coordinates)
                .setPopup(popUp)
                .addTo(map);

            marker.getElement().addEventListener('click', (e) => {
                {
                    // marker.setLngLat([10,10]);
                    handleLayerMarker(marker);
                    flyToStore(i);
                    // marker.remove()
                }
            }, false);
            
        }
        // function deleteMarker() {
        //     marker.remove()
        // }

    }

    );

    function flyToStore(currentFeature: any) {
        map.flyTo({
            center: currentFeature.geometry.coordinates,
            zoom: 16
        });
    }
    // console.log(marker.getLngLat())
    // markerArray.push(marker);
    // console.log(markerArray[0].getLngLat())
}