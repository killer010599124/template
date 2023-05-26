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
import { CSVLink, CSVDownload } from "react-csv";
import PDLJSClient from './PDL';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './generatePDF';
import jsPDF from 'jspdf';


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
function makeQuery(first_name: string, last_name: string, address: string, email: string, phone: string) {
  return `SELECT * FROM person WHERE first_name = '${first_name}' AND last_name ='${last_name}' AND personal_emails ='${email}' AND phone_numbers = '${phone}' ;`
}

const SatelitteMap = () => {

  const mapRef = useRef<HTMLDivElement>(null);
  const childRef = useRef(null);
  const [dataVisible, setDataVisible] = useState(1);
  const [layerVisible, setLayerVisible] = useState(1);
  const [drawToolVisible, setDrawToolVisible] = useState(1);
  const [value, setValue] = React.useState(0);
  const [drawMode, setDrawMode] = useState('');

  const [toggle, setToggle] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleToggle = () => {
    setToggle(!toggle);
  }

  const [lng, setLng] = useState("");
  const [lat, setLat] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("")
  const [geoStyleName, setGeoStyleName] = useState("mapbox://styles/mapbox/satellite-streets-v12")
  interface Geo {
    description: string;
    name: string;
    lat: string;
    lng: string;
  }
  const [flag, setFlag] = useState(0);
  const [addFlag, setAddFlag] = useState(true);
  const [deleteFlag, setDeleteFlag] = useState(true);
  const [data, setData] = useState<Geo>();
  const [allData, setAllData] = useState<Geo[]>([]);
  const [array, setArray] = useState<Geo[]>([]);
  const [csvData, setCsvData] = useState<Geo>({ description: "The capital of Russia", name: "Moscow", lng: "-99.1319063199852", lat: "25.16901932031443" })
  const fileReader = new FileReader();

  //--------   P&B search engine-----------//

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [content, setContent] = useState('');

  const [pid, setPid] = useState('');
  const [pname, setPName] = useState('');
  const [paddress, setPaddress] = useState('');
  const [pemail, setPemail] = useState('');
  const [pphone, setPphone] = useState('');
  const [pfacebook, setPfacebook] = useState('');
  const [plinkdin, setPlinkdin] = useState('');
  const [ptwitter, setPtwitter] = useState('');



  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [3, 2],
  });

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


  let names = [
    { firstName: 'John', lastName: 'Cena' },
    { firstName: 'Rey', lastName: 'Mysterio' },
  ]
  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf("\n") - 1).split(",");

    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object: any, header, index) => {
        object[header] = values[index];


        return object;
      }, {});
      console.log(obj);
      if (!Number.isNaN(Number(obj.lng))) manageAllData(obj);
      // if (obj['name']) setCsvData(obj)
      return obj;
    });
    console.log(array.pop())
    // setAllData(array);
    // allData.pop()
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
  };
  const manageAllData = (data: Geo) => {
    setAllData(prevNames => [...prevNames, data])

  };

  const myMap = useMap(mapRef, name, description, lat, lng, addFlag, "mapbox://styles/mapbox/satellite-streets-v12", handleLongtitude, handleLatitude, geoStyleName, array, drawMode, toggle, deleteFlag)

  useEffect(() => {
    if (flag == 1) {

      // manageData({ name, lat, lng });
      // manageAllData({ name, lat, lng })
      setFlag(0);
    }

  }, [lat, lng])
  return (
    <>


      {/* --------------------------- Side Tool Bar --------------------------- */}
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
        <button className='toolButton'
          onClick={() => {

          }}>
          P&B
        </button>
      </div>

      {/* ----------------------------Basic Map Style layout --------------------- */}

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

      {/* ----------------------Draw Geofence tool layout ---------------------- */}

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
              <Tab label="Rect" {...a11yProps(0)} style={{ color: "white" }}
                onClick={() => {
                  setDrawMode('RECT');
                  handleToggle();
                }} />
              <Tab label="Circle" {...a11yProps(1)} style={{ color: "white" }}
                onClick={() => {
                  setDrawMode('Circle');
                  handleToggle();
                }} />
              <Tab label="poly" {...a11yProps(2)} style={{ color: "white" }}
                onClick={() => {
                  setDrawMode('Polygon');
                  handleToggle();
                }} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0} >

            <div className='drawTab'>
              <div style={{ paddingBottom: "10px" }}>
                Properties
              </div>

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
              <div style={{ paddingBottom: "10px" }}>
                Properties
              </div>
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
              <div style={{ paddingBottom: "10px" }}>
                Properties
              </div>
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Count</label>
                <input type="text" style={{ borderColor: "white" }} />
              </div>
              <div style={{ display: "flex" }}>

                <label style={{ paddingTop: '3px', paddingRight: '5px', width: '60px' }} >Points</label>
                <textarea style={{ borderColor: "white", height: "85px" }} />
              </div>
            </div>
          </TabPanel>
          <button className='geoStyleBtn' style={{ marginLeft: '20px' }}>Search</button>
        </Box>
      </div>

      {/* ---------------------------Point Data layout ----------------------- */}
      <div style={{
        position: "absolute",
        right: "0px",
        marginTop: "-1%",
        marginRight: "50px", zIndex: "1"
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
          <textarea placeholder="Description" value={description} onChange={(e) => { setDescription(e.target.value) }}></textarea>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: "space-evenly",
            paddingTop: "5px"
          }}>
            <input type="button" value={"Add"} onClick={() => {
              setAddFlag(!addFlag);
              manageData({ description, name, lat, lng });
              manageAllData({ description, name, lat, lng });
              console.log(data);
            }} />
            <input type="button" value={"Edit"} />
            <input type="button" value={"Delete"} onClick={() => {
              setDeleteFlag(!deleteFlag);
            }} />
          </div>

        </form>
      </div>

      {/* -------------------------   P&B layout --------------------- */}

      <div style={{
        position: "absolute",
        right: "20%",
        marginTop: "7%",

        zIndex: "1",
        width: "60%",
        height: "600px",
        backgroundColor: "black",
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '10px',
        opacity: '0.75'
      }}>
        <div style={{
          width: "30%", height: "100%", borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px',
          borderRight: '0.1rem solid white'
        }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Person" {...a11yProps(0)} style={{ color: "white", width: '50%' }}
                />
                <Tab label="company" {...a11yProps(1)} style={{ color: "white", width: '50%' }}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0} >

              <div className='drawTab'>
                <div style={{ paddingBottom: "10px" }}>

                </div>

                <div style={{ display: "flex" }}>


                  <input type="text" placeholder='First Name' value={firstName} onChange={(e) => { setFirstName(e.target.value) }} style={{ borderColor: "white", width: '50%' }} />
                  <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => { setLastName(e.target.value) }} style={{ marginLeft: '5px', width: "50%", borderColor: "white" }} />
                </div>

                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Address' value={address} onChange={(e) => { setAddress(e.target.value) }} style={{ width: '100%', borderColor: "white" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', borderColor: "white" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Phone' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ width: '100%', borderColor: "white" }} />
                </div>

              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className='drawTab'>
                <div style={{ paddingBottom: "10px" }}>

                </div>

                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Name' style={{ width: '100%', borderColor: "white" }} />
                </div>

                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Profile' style={{ width: '100%', borderColor: "white" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Ticker' style={{ width: '100%', borderColor: "white" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Location' style={{ width: '100%', borderColor: "white" }} />
                </div>
              </div>

            </TabPanel>

            <button className='geoStyleBtn' style={{ marginLeft: '20px' }}
              onClick={() => {
                const query = makeQuery(firstName, lastName, address, email, phoneNumber);
                console.log(query);
                PDLJSClient.person.search.sql({
                  searchQuery: query,
                  size: 10,
                }).then((data) => {
                  console.log(data['data'][0]);
                  const str = "id:" + data['data'][0]['id'] + "\n" + "Name:" + data['data'][0]['full_name'] + "\n" + "Address:" + data['data'][0]['location_street_address'] +
                    "\n" + "Emails:" + data['data'][0]['personal_emails'] + "\n" + "Phone Number:" + data['data'][0]['phone_numbers'] + "\n" +
                    "facebook_id:" + data['data'][0]['facebook_id'] + ",  Url:" + data['data'][0]['facebook_url'] +
                    ",   Username:" + data['data'][0]['facebook_username'] + "\n" +
                    "linkedin_id:" + data['data'][0]['linkedin_id'] + ",  Url:" + data['data'][0]['linkedin_url'] +
                    ",   Username:" + data['data'][0]['linkedin_username'] + "\n" +
                    "Twitter_Url:" + data['data'][0]['twitter_url'] +
                    ",   Username:" + data['data'][0]['twitter_username'];

                  setPid("id  : " + data['data'][0]['id']);
                  setPName("Name  : " + data['data'][0]['full_name']);
                  setPaddress("Address  : " + data['data'][0]['location_street_address']);
                  setPemail("Emails : " + data['data'][0]['personal_emails']);
                  setPphone("Phone Number : " + data['data'][0]['phone_numbers']);
                  setPfacebook("facebook => id  : " + data['data'][0]['facebook_id'] + ",  Url  : " + data['data'][0]['facebook_url'] + ",   Username : " + data['data'][0]['facebook_username']);
                  setPlinkdin("linkedin => id : " + data['data'][0]['linkedin_id'] + ",  Url  : " + data['data'][0]['linkedin_url'] + ",   Username : " + data['data'][0]['linkedin_username']);
                  setPtwitter("Twitter => Url : " + data['data'][0]['twitter_url'] + ",   Username  : " + data['data'][0]['twitter_username']);

                  // JSON.parse(data);
                  setContent(str);
                  console.log(content)

                }).catch((error) => {
                  setContent('No search results');
                  console.log(error);
                });
              }}
            >Search</button>
            <button className='geoStyleBtn' style={{ marginLeft: '20px' }}
              onClick={() => {
                doc.text('Hello world!', 1, 1);
                doc.save('helloWorld.pdf');
              }}
            >Download</button>
          </Box>
        </div>
        <div style={{ width: '70%', height: '100%', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
          <div style={{ fontSize: '24px', lineHeight: '45px', color: 'white', width: '100%', height: '50px', textAlign: 'center', borderBottom: '0.05em solid white' }}>
            Content
          </div>
          <div style={{ color: "white", padding: "100px", textAlign: 'center' }}>
            <div>{pid}</div>
            <div>{pname}</div>
            <div>{paddress}</div>
            <div>{pemail}</div>
            <div>{pphone}</div>
            <div>{pfacebook}</div>
            <div>{plinkdin}</div>
            <div>{ptwitter}</div>

          </div>
        </div>
      </div>


      {/* ------------------------- Geo Point Table layout-------------------- */}
      <div style={dataVisible ? { display: "none" } : {
        display: "block",
        position: "absolute",
        right: "0px",
        marginTop: "280px",
        marginRight: "75px", zIndex: "1",
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
              <th>Name</th>
              <th>Lng</th>
              <th>Lat</th>
            </tr>
          </thead>
          <tbody>
            {allData.map((data, index) => {
              return (
                <tr>
                  <td><img src={assets.images.geoMark} style={{ width: "20px", height: "20px" }} /></td>
                  <td>{data?.name}</td>
                  <td>{(Number(data?.lng).toFixed(3)).toString()}</td>
                  <td>{(Number(data?.lat).toFixed(3)).toString()}</td>
                </tr>
              );
            })}

          </tbody>
        </table>
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
            right: "50px",
            marginBottom: "4%",
            bottom: "0"
            // overflowY: 'scroll'
          }}>
          <label className='csv'>
            <input id="Image" type="file" onChange={handleOnChange} />
            Import CSV
          </label>
          {/* <label className='csv'>
            Export CSV
          </label> */}
          <CSVLink data={allData}><button className='csv' style={{ height: '33px', fontSize: '15px' }}>Export CSV</button></CSVLink>
        </div>
      </div>


      <div ref={mapRef} className='map' style={{ padding: "0px !important", height: "94%", width: "100%" }} />

    </>


  )
};

export default SatelitteMap;