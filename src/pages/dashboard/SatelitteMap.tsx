import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { initMap } from './initMap';
import { useMap } from './useMap';
import assets from '../../assets';
import "./style.css"

type Props = {};

const SatelitteMap = (props: Props) => {

  const mapRef = useRef<HTMLDivElement>(null);
  useMap(mapRef, "mapbox://styles/mapbox/satellite-streets-v12")

  return (
    <>
      <div style={{
        position: "absolute",
        marginTop: "2%",
        marginLeft: "2%", zIndex: "1"
      }}>
        <button style={{
          width: "50px", height: "50px",
          borderRadius: "25px",
          background: "transparent",
          borderColor: "white",
          borderWidth: "5px"
        }}>
          <img src={assets.images.data} style={{ width: "100%", height: "100%" }} />
        </button>
      </div>
      <div style={{
        position: "absolute",
        right: "0px",
        marginTop: "2%",
        marginRight: "2%", zIndex: "1"
      }}>
        <form>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-evenly",
            paddingTop : "25px"
          }}>
            <input type="text" placeholder="Name" />
            <input type="date" placeholder="Date" />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-evenly"
          }}>
            <input type="text" placeholder="Longtitude" />
            <input type="text" placeholder="Latitude" />
          </div>
          <textarea placeholder="Your Message"></textarea>
          {/* <button className='addBtn' >Add</button> */}
        </form>
      </div>


      <div ref={mapRef} className='map' style={{ padding: "0px !important", height: "94%", width: "100%" }} />

    </>


  )
};

export default SatelitteMap;