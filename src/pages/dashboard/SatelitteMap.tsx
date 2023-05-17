import React from 'react';
import { useRef, useState, } from 'react';
import { useEffect, } from 'react';
import { initMap } from './initMap';
import { useMap } from './useMap';
import assets from '../../assets';
import "./style.css"



type Props = {};

const SatelitteMap = () => {

  const mapRef = useRef<HTMLDivElement>(null);
  const childRef = useRef(null);
  const [dataVisible, setDataVisible] = useState(1);

  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [name, setName] = useState("");
  const [geoStyleName, setGeoStyleName] = useState("mapbox://styles/mapbox/satellite-streets-v12")
  interface Geo {
    name: string;
    lat: string;
    lng: string;
  }
  const [flag, setFlag] = useState(0);
  const [addFlag, setAddFlag] = useState(true);
  const [data, setData] = useState<Geo>();
  const [allData, setAllData] = useState<Geo[]>([]);

  const handleLongtitude = (num: number) => {
    // 👇️ take the parameter passed from the Child component
    setLng(num.toString());

    // console.log('argument from Child: ', lng);
  };
  const handleLatitude = (num: number) => {
    // 👇️ take the parameter passed from the Child component
    setLat(num.toString());
    setFlag(1);
    // console.log('argument from Child: ', lng);
  };
  const manageData = (data: Geo) => {
    setData(data);
  }
  const manageAllData = (data: Geo) => {
    setAllData(prevNames => [...prevNames, data])

  }

  useMap(mapRef, lat, lng, addFlag, "mapbox://styles/mapbox/satellite-streets-v12", handleLongtitude, handleLatitude, geoStyleName)

  useEffect(() => {
    if (flag == 1) {

      manageData({ name, lat, lng });
      manageAllData({ name, lat, lng })
      setFlag(0);
    }

  }, [lat, lng])
  return (
    <>
      <div>


      </div>
      <div style={{
        position: "absolute",
        marginTop: "4%",
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
            if (dataVisible) setDataVisible(0);
            else setDataVisible(1);
          }}
        >
          <img src={assets.images.data} style={{ width: "100%", height: "100%" }} />
        </button>
      </div>
      <div style={{
        position: "absolute",
        marginTop: "1%",
        marginLeft: "1%", zIndex: "1",
        opacity: "0.75",
        background: "black",
        padding: "8px",
        borderRadius: "20px"
      }}>
        <button className="geoStyleBtn" onClick={() => setGeoStyleName("mapbox://styles/mapbox/light-v11")}>Light</button>
        <button className="geoStyleBtn" onClick={() => setGeoStyleName("mapbox://styles/mapbox/dark-v11")}>Dark</button>
        <button className="geoStyleBtn" onClick={() => setGeoStyleName("mapbox://styles/mapbox/streets-v12")}>Street</button>
        <button className="geoStyleBtn" onClick={() => setGeoStyleName("mapbox://styles/mapbox/satellite-streets-v12")}>Satelitte</button>
      </div>
      <div style={{
        position: "absolute",
        right: "0px",
        marginTop: "-1%",
        marginRight: "2%", zIndex: "1"
      }}>
        <form style={dataVisible ? { display: "none" } : { display: "block" }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-evenly",
            paddingTop: "25px"
          }}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
            <input type="date" placeholder="Date" />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-evenly"
          }}>
            <input type="text" placeholder="Longtitude" value={lng.toString()} onChange={(e) => { setLng(e.target.value) }} />
            <input type="text" placeholder="Latitude" value={lat.toString()} onChange={(e) => { setLat(e.target.value) }} />
          </div>
          <textarea placeholder="Description"></textarea>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-evenly",
            paddingTop: "5px"
          }}>
            <input type="button" value={"Add"} onClick={() => {
              setAddFlag(!addFlag);
              manageData({ name, lat, lng });
              manageAllData({ name, lat, lng });
              console.log(data);
            }} />
            <input type="button" value={"Edit"} />
            <input type="button" value={"Delete"} />
          </div>

        </form>
      </div>
      <div style={dataVisible ? { display: "none" } : {
        display: "block",
        position: "absolute",
        right: "0px",
        marginTop: "280px",
        marginRight: "70px", zIndex: "1",
        background: "black",
        opacity: "0.75",
        color: "white",
        width: "345px",
        height: "55%",
        padding: "5px",
        borderRadius: "10px",
        // overflowY: 'scroll'
      }

      }>
        <table style={{
          textAlign: "center",
          width: "100%",
          // height: "100%"
        }}>
          <thead>
            <tr>
              <th>Mark</th>
              {/* <th>Name</th> */}
              <th>Lng</th>
              <th>Lat</th>
            </tr>
          </thead>
          <tbody>
            {allData.map((data, index) => {
              return (
                <tr>
                  <td><img src={assets.images.geoMark} style={{ width: "20px", height: "20px" }} /></td>
                  {/* <td>{data?.name}</td> */}
                  <td>{(Number(data?.lng).toFixed(3)).toString()}</td>
                  <td>{(Number(data?.lat).toFixed(3)).toString()}</td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      <div
        style={dataVisible ? { display: "none" } : {
          // display: "block",
          position: "absolute",
          display: 'flex',
          flexDirection: 'row',
          justifyContent: "space-evenly",
          paddingTop: "5px",
          zIndex: '1',
          width: "250px",
          right: "5.5%",
          marginBottom: "4%",
          bottom: "0"
          // overflowY: 'scroll'
        }}>
        <label className='csv'>
          <input id="Image" type="file" />
            Import CSV
        </label>
        <input type="button" value={"Export CSV"} />
      </div>
      <div ref={mapRef} className='map' style={{ padding: "0px !important", height: "94%", width: "100%" }} />

    </>


  )
};

export default SatelitteMap;