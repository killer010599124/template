import React from 'react';
import { useRef, useState, } from 'react';
import { useEffect, } from 'react';
import { initMap } from './initMap';
import { useMap } from './useMap';
import assets from '../../assets';
import "./style.css";
import Tab from '@mui/material/Tab/Tab';
import DrawControl from 'react-mapbox-gl-draw';
// import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import Geocoder from './Geocoder'; 
import { AddressAutofill } from '@mapbox/search-js-react';
import { Box, Tabs } from '@mui/material';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (

        <div>{children}</div>

      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SatelitteMap = () => {

  const mapRef = useRef<HTMLDivElement>(null);
  const childRef = useRef(null);
  const [dataVisible, setDataVisible] = useState(1);
  const [layerVisible, setLayerVisible] = useState(1);
  const [drawToolVisible, setDrawToolVisible] = useState(1);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
  const [array, setArray] = useState<Geo[]>([]);
  const [csvData, setCsvData] = useState<Geo>({ name: "Moscow", lng: "-99.1319063199852", lat: "25.16901932031443" })
  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    // setFile(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      fileReader.onload = function (event: any) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput);
        // console.log(csvOutput)
      };

      fileReader.readAsText(file);
    }
  };



  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf("\n") - 1).split(",");

    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object: any, header, index) => {
        object[header] = values[index];


        return object;
      }, {});
      console.log(obj)
      if (obj['name']) setCsvData(obj)
      return obj;
    });
    console.log(array.pop())
    setAllData(array)
    setArray(array);
  };
  const headerKeys = Object.keys(Object.assign({}, ...array));

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

  useMap(mapRef, lat, lng, addFlag, "mapbox://styles/mapbox/satellite-streets-v12", handleLongtitude, handleLatitude, geoStyleName, array)

  useEffect(() => {
    if (flag == 1) {

      manageData({ name, lat, lng });
      manageAllData({ name, lat, lng })
      setFlag(0);
    }

  }, [lat, lng])
  return (
    <>

      <div style={{
        position: "absolute",
        marginTop: "4%",
        marginLeft: "2%", zIndex: "1",
        display: "flex",
        flexDirection: 'column',
      }}>
        <button className='toolButton'
          onClick={() => {
            if (layerVisible) setLayerVisible(0);
            else setLayerVisible(1);
          }}>
          Layer
        </button>
        <button className='toolButton'
          onClick={() => {
            if (dataVisible) setDataVisible(0);
            else setDataVisible(1);
          }}
        >
          Data
          {/* <img src={assets.images.data} style={{ width: "60%", height: "60%" }} /> */}
        </button>

        <button className='toolButton'
          onClick={() => {
            if (drawToolVisible) setDrawToolVisible(0);
            else setDrawToolVisible(1);
          }}>
          Draw
        </button>
      </div>
      <div style={layerVisible ? { display: "none" } :
        {
          position: "absolute",
          marginTop: "5%",
          marginLeft: "5%", zIndex: "2",
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

      <div style={drawToolVisible ? { display: "none" } :
        {
          position: "absolute",
          marginTop: "11.7%",
          marginLeft: "5%", zIndex: "2",
          opacity: "0.75",
          width: '13.5%',
          background: "black",
          padding: "8px",
          height: "300px",
          borderRadius: "10px",
          justifyContent: 'space-between',
          display: 'flex'
        }}>


        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Rect" {...a11yProps(0)} style={{ color: "white" }} />
              <Tab label="Circle" {...a11yProps(1)} style={{ color: "white" }} />
              <Tab label="poly" {...a11yProps(2)} style={{ color: "white" }} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0} >

            <div className='drawTab'>
              Properties
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Point</label>
                <input type="text" style={{ borderColor: "white" }} />
              </div>
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >width</label>
                <input type="text" style={{ borderColor: "white" }} />
              </div>
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Height</label>
                <input type="text" style={{ borderColor: "white" }} />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className='drawTab'>
              Properties
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Point</label>
                <input type="text" style={{ borderColor: "white" }} />
              </div>
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Radius</label>
                <input type="text" style={{ borderColor: "white" }} />
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className='drawTab'>
              Properties
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Count</label>
                <input type="text" style={{ borderColor: "white" }} />
              </div>
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Points</label>
                <textarea  style={{ borderColor: "white" }} />
              </div>
            </div>
          </TabPanel>
          <button className='geoStyleBtn' style={{marginLeft:'20px'}}>Search</button>
        </Box>
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
          <input id="Image" type="file" onChange={handleOnChange} />
          Import CSV
        </label>
        <input type="button" value={"Export CSV"} />
      </div>
      <div ref={mapRef} className='map' style={{ padding: "0px !important", height: "94%", width: "100%" }} />

    </>


  )
};

export default SatelitteMap;