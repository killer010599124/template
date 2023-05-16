import React from 'react';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { initMap } from './initMap';
import { useMap } from './useMap';
import assets from '../../assets';
import "./style.css"

type Props = {};

const SatelitteMap = (props: Props) => {

  const mapRef = useRef<HTMLDivElement>(null);
  const [dataVisible, setDataVisible] = useState(1);
 
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  const handleLongtitude = (num: number) => {
    // 👇️ take the parameter passed from the Child component
    setLng(num);

    // console.log('argument from Child: ', lng);
  };
  const handleLatitude = (num: number) => {
    // 👇️ take the parameter passed from the Child component
    setLat(num);

    // console.log('argument from Child: ', lng);
  };

  useMap(mapRef, "mapbox://styles/mapbox/satellite-streets-v12", handleLongtitude,handleLatitude)

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
        }}
        onClick={() => {
          if(dataVisible) setDataVisible(0);
          else setDataVisible(1);
        }}
        >
          <img src={assets.images.data} style={{ width: "100%", height: "100%" }} />
        </button>
      </div>
      <div style={{
        position: "absolute",
        right: "0px",
        marginTop: "-1%",
        marginRight: "2%", zIndex: "1"
      }}>
        <form style={dataVisible ? {display : "none"} : {display : "block"}}>
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
            <input type="text" placeholder="Longtitude" value={lng}/>
            <input type="text" placeholder="Latitude" value={lat}/>
          </div>
          <textarea placeholder="Description"></textarea>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-evenly",
            paddingTop : "5px"
          }}>
            <input type = "button"  value={"Add"} />
            <input type = "button"  value={"Edit"} />
            <input type = "button"  value={"Delete"} />
          </div>
          
        </form>
      </div>


      <div ref={mapRef} className='map' style={{ padding: "0px !important", height: "94%", width: "100%" }} />

    </>


  )
};

export default SatelitteMap;