import { Popup, Marker, Map } from 'mapbox-gl';

export const addMarkers = (geodata: any, map: Map, handleLayerMarker: (marker: Marker) => void) => {

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

                html += `<div class = "${header}">${header} : ${values[header]}</div>`
                // object[header] = values[header];
                // return object;
            }, {});
            html += `<button  class = 'deletemarker' > delete </button>`;
            html += `<button  class = 'editmarker' > edit </button>`;
            // html += `<button  class = 'deletemarker' > delete </button>`;
            const popUp = new Popup({ anchor: 'left', })
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
            if (document.getElementsByClassName('deletemarker')[0]) {

            }

        }

    }

    );
    function deleteMarker() {
        alert('delete');
    }
    function flyToStore(currentFeature: any) {
        map.flyTo({
            center: currentFeature.geometry.coordinates,
            zoom: 18
        });
    }
}