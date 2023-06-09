import { Popup, Marker, Map } from 'mapbox-gl';

export const generateOneMarker = (currentGeodata: any, map: Map, handleLayerMarker: (marker: Marker) => void, updateMarkerCoordinates: (coord: any) => void, lnglat : any) => {

    
    

        // let marker = new Marker;
        if (currentGeodata) {
            const i = currentGeodata.features[0];
            const cheader = Object.keys(i.properties);
            let html = '';
            const values = i.properties;
    
            html += `<div style="background:black; color : white; opacity : 0.75; padding: 10px; border-radius: 10px;">`;
            const obj = cheader.reduce((object: any, header, index) => {
                html += `<div style="width:100%; display:flex">
                         <label for="name" style="width:40%; text-align:right; padding-right: 5px;" >${header} :</label>
                         <input type="text" value = "" style="width:60%; border: 0.01em solid white;" class = "${header}">
                     </div>
                     `
                // html += `<div class = "${header}">${header} : ${values[header]}</div>`
                // object[header] = values[header];
                // return object;
            }, {});
            html += `<div style="width:100%; display:flex">
                         <label for="name" style="width:40%; text-align:right; padding-right: 5px;" >Latitude :</label>
                         <input type="text" value = "${lnglat.lat}" style="width:60%; border: 0.01em solid white;" class = "latitude">
                     </div>`;
            html += `<div style="width:100%; display:flex">
                     <label for="name" style="width:40%; text-align:right; padding-right: 5px;" >Longtitude :</label>
                     <input type="text" value = "${lnglat.lng}" style="width:60%; border: 0.01em solid white;" class = "longtitude">
                 </div>`;
            html += `<div style = "display:flex; justify-content:space-around;">
            <button class='savemarker' > save </button>
            <button class='deletemarker' > delete </button>
            <button class='cancelmarker' > cancel </button>
          </div>`;

            const popUp = new Popup({ closeButton: false, anchor: 'left' })
                .setHTML(html);
            let valuelist: string[] = [];

            popUp.on('open', () => {
                for (let i = 0; i < cheader.length; i++) {
                    valuelist[i] = (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).getAttribute('value') as string;
                }
                valuelist[cheader.length] = (document.getElementsByClassName('latitude')[0] as HTMLInputElement).getAttribute('value') as string;
                valuelist[cheader.length + 1] = (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).getAttribute('value') as string;

            });
            popUp.on('close', () => {
                console.log('close')
                setTimeout(() => {
                    if(!document.getElementsByClassName('mapboxgl-popup')[0]){
                        console.log('closed')
                        marker.setLngLat([Number(valuelist[cheader.length+1]),Number(valuelist[cheader.length])])
                    }
                }, 10);     
            });
            const marker = new Marker({ color: 'red', scale: 0.8 })
                .setDraggable(false)
                .setLngLat(lnglat)
                .setPopup(popUp)
                .addTo(map)
                .on('drag', (event: any) => {
                    // console.log(event.target._lngLat)
                    updateMarkerCoordinates(event.target._lngLat);
                })

            marker.getElement().addEventListener('mouseup', (e) => {
                marker.setDraggable(false);
                if (!document.getElementsByClassName('mapboxgl-popup')[0]) {
                    setTimeout(() => {
                        for (let i = 0; i < cheader.length; i++) {
                            (document.getElementsByClassName(cheader[i])[0] as HTMLInputElement).value = valuelist[i]
                        }
                        (document.getElementsByClassName('latitude')[0] as HTMLInputElement).value = valuelist[cheader.length];
                        (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).value = valuelist[cheader.length + 1];       
                    }, 10)
                }
            })
            marker.getElement().addEventListener('mousedown', (e) => {
                if (document.getElementsByClassName('mapboxgl-popup')[0]) {
                    marker.setDraggable(true);
                }
            })
            marker.getElement().addEventListener('click', (e) => {
                {
                   
                    handleLayerMarker(marker);
                    map.flyTo({
                        center: marker.getLngLat(),
                        zoom: 18
                    });

                    // (document.getElementsByClassName('lattitude')[0] as HTMLInputElement).setAttribute('value', marker.getLngLat().lat.toString());
                    // (document.getElementsByClassName('longtitude')[0] as HTMLInputElement).setAttribute('value', marker.getLngLat().lng.toString());
                }
            }, false);
           

        }

    

    
    
}