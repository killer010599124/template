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
            // <div style="background:black; color : white; opacity : 0.75;">
            //     <div style="width:100%; display:flex">
            //         <label for="name" style="width:30%; text-align:right">Nameasdasd:</label>
            //         <input type="text" id="name" name="name" style="width:70%">
            //     </div>
            //     <br>
            //         <div style="width:100%; display:flex">
            //             <label for="name" style="width:30%; text-align:right">fad:</label>
            //             <input type="text" id="name" name="name" style="width:70%">
            //         </div>
            //         <br>
            //             <div style="width:100%; display:flex">
            //                 <label for="name" style="width:30%; text-align:right;padding-right:0px">asdf:</label>
            //                 <input type="text" id="name" name="name" style="width:70%; background:black; border:0.01rem solid white">
            //             </div>

            //         </div>
            html += `<div style="background:black; color : white; opacity : 0.75; padding: 10px; border-radius: 10px;">`;
            const obj = cheader.reduce((object: any, header, index) => {
                html += `<div style="width:100%; display:flex">
                         <label for="name" style="width:40%; text-align:right; padding-right: 5px;" >${header} :</label>
                         <input type="text" id="name" name="name" value = "${values[header]}" style="width:60%; border: 0.01em solid white;" class = "${header}">
                     </div>
                     `
                // html += `<div class = "${header}">${header} : ${values[header]}</div>`
                // object[header] = values[header];
                // return object;
            }, {});
            html += `<div style = "display:flex; justify-content:space-around;">
            <button class='savemarker' > save </button>
            <button class='deletemarker' > delete </button>
            <button class='cancelmarker' > cancel </button>
          </div>`

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