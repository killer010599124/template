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
import colorConfigs from '../../configs/colorConfigs';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel_Draw(props: TabPanelProps) {
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
function a11yProps_Draw(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function TabPanel_PB(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="TabPanel_PB"
      hidden={value !== index}
      id={`simple-tabpanel_pb-${index}`}
      aria-labelledby={`simple-tab_pb-${index}`}
      {...other}
    >
      {value === index && (

        <div>{children}</div>

      )}
    </div>
  );
}

function a11yProps_PB(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel_pb-${index}`,
  };
}

function a11yProps_DV(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel_dv-${index}`,
  };
}

function TabPanel_DV(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="TabPanel_DV"
      hidden={value !== index}
      id={`simple-tabpanel_dv-${index}`}
      aria-labelledby={`simple-tab_dv-${index}`}
      {...other}
    >
      {value === index && (

        <div>{children}</div>

      )}
    </div>
  );
}

function makePersonQuery(first_name: string, last_name: string, address: string, email: string, phone: string) {
  return `SELECT * FROM person WHERE first_name = '${first_name}' AND last_name ='${last_name}' AND personal_emails ='${email}' AND phone_numbers = '${phone}' ;`
}
function makeCompanyQuery(name: string, ticker: string, website: string) {
  return `SELECT * FROM company WHERE name = '${name}' AND ticker ='${ticker}' AND website ='${website}';`
}




const SatelitteMap = (context: any) => {

  const mapRef = useRef<HTMLDivElement>(null);
  const childRef = useRef(null);
  const reportTemplateRef = useRef<HTMLDivElement>(null);

  const [dataVisible, setDataVisible] = useState(1);
  const [layerVisible, setLayerVisible] = useState(1);
  const [drawToolVisible, setDrawToolVisible] = useState(1);
  const [pbVisible, setPbVisible] = useState(1);

  const [value_tab_draw, setValue_tab_draw] = React.useState(0);
  const [value_tab_pb, setValue_tab_pb] = React.useState(0);
  const [value_tab_dv, setValue_tab_dv] = React.useState(0);

  const [drawMode, setDrawMode] = useState('');

  const [toggle, setToggle] = useState(true);

  const handleTabDrawChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue_tab_draw(newValue);
  };
  const handleTabPBChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue_tab_pb(newValue);
  };
  const handleTabDVChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue_tab_dv(newValue);
  };

  const handleToggle = () => {
    setToggle(!toggle);
  }
  const handleGeneratePdf = () => {
    const doc = new jsPDF('p', 'mm', [1000, 750]);

    // Adding the fonts.
    doc.setFont('Inter-Regular', 'normal');

    const input = document.getElementsByClassName('PBData')[0];
    const el1: HTMLElement = input as HTMLElement;
    el1.style.color = 'black';
    doc.html(el1, {
      async callback(doc) {
        doc.save('report.pdf');
        el1.style.color = 'white';
      },
    });
  };

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
  const [editFlag, setEditFlag] = useState(true);
  const [deleteFlag, setDeleteFlag] = useState(true);
  const [dataLayerFlag, setDataLayerFlag] = useState(true);

  const csv2geojson = require('csv2geojson');
  const geojsonNormalize = require('@mapbox/geojson-normalize');
  const readFile = require('./readCsvFile');

  const [data, setData] = useState<Geo>();
  const [allData, setAllData] = useState<Geo[]>([]);
  const [array, setArray] = useState<Geo[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeader, setCsvHeader] = useState<string[]>([]);
  const [geodata, setGeodata] = useState<any>()
  const [layer, setLayer] = useState('');

  const [dataLayers, setDataLayers] = useState<string[]>([]);


  const fileReader = new FileReader();

  //--------   Person search engine-----------//

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

  const [pfacebook_id, setPfacebook_id] = useState('');
  const [pfacebook_url, setPfacebook_url] = useState('');
  const [pfacebook_un, setPfacebook_un] = useState('');

  const [plinkdin_id, setPlinkdin_id] = useState('');
  const [plinkdin_url, setPlinkdin_url] = useState('');
  const [plinkdin_un, setPlinkdin_un] = useState('');

  const [ptwitter_url, setPtwitter_url] = useState('');
  const [ptwitter_un, setPtwitter_un] = useState('');

  const [dvMode, setDvMode] = useState('table');
  const [pbMode, setPbMode] = useState('person');
  const [isSearchResult, setIsSearchResult] = useState(false);
  //------------------------- Company Search Engine ------------------//

  const [cName, setCName] = useState('');
  const [cWebsite, setCWebsite] = useState('');
  const [cticker, setCticker] = useState('');



  const [bid, setBid] = useState('');
  const [bname, setBname] = useState('');
  const [bfounded, setBfounded] = useState<number>();
  const [bindustry, setBindustry] = useState('');
  const [bwebsite, setBwebsite] = useState('');
  const [bsummary, setBsummary] = useState('');

  // Linkdlin:<br />Facebook:<br />Twitter:<br />Crunchbase:
  const [blinkdin, setBlinkdin] = useState('');
  const [bfacebook, setBfacebook] = useState('');
  const [btwitter, setBtwitter] = useState('');
  const [bcrunchbase, setCrunchbase] = useState('');


  const doc = new jsPDF('l', 'pt', 'a4');

  const OpenCSVFile = (e: any) => {
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

  const readCSVFile = (e: any,) => {
    const file = e.target.files[0];

    // setGeodata({});
    readFile.readAsText(file, (err: any, text: any) => {
      // console.log(text)

      csv2geojson.csv2geojson(
        text,
        {
          delimiter: 'auto'
        },
        (err: any, result: any) => {
          if (err) {

          } else {

            setGeodata([]);
            setGeodata(result);

            setCsvData([]);

            const cheader = Object.keys(result.features[0].properties);
            setCsvHeader(cheader);
            const array = result.features.map((i: any) => {

              const values = i.properties;
              const obj = cheader.reduce((object: any, header, index) => {

                object[header] = values[header];
                return object;
              }, {});
              manageCsvData(obj);
              return obj;
            });


          }
        }
      );
    });
  }



  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf("\n") - 1).split(",");
    for (let i = 0; i < csvHeader.length; i++) {
      csvHeader[i] = csvHeader[i].replaceAll('"', '');
    }
    console.log(csvHeader);
    setCsvHeader(csvHeader);
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map(i => {
      console.log(i)
      const values = i.split(",");
      const obj = csvHeader.reduce((object: any, header, index) => {
        object[header] = values[index].replaceAll('"', '');
        return object;
      }, {});
      console.log(obj);
      // manageCsvData(obj);
      if (!Number.isNaN(Number(obj.lng))) manageAllData(obj);

      return obj;
    });
    // setCsvData(array);

    setArray(array);
  };


  const clearPersonData = () => {
    setPid("");
    setPName("");
    setPaddress("");
    setPemail("");
    setPphone("");
    setPfacebook_id("");
    setPfacebook_url("");
    setPfacebook_un("");

    setPlinkdin_id("");
    setPlinkdin_url("");
    setPlinkdin_un("");

    setPtwitter_url("");
    setPtwitter_un("");
  }
  const getPersonData = () => {
    clearPersonData();
    const query = makePersonQuery(firstName, lastName, address, email, phoneNumber);
    console.log(query);
    PDLJSClient.person.search.sql({
      searchQuery: query,
      size: 10,
    }).then((data) => {

      setPid("" + data['data'][0]['id']);
      setPName("" + data['data'][0]['full_name']);
      setPaddress("" + data['data'][0]['location_street_address']);
      setPemail("" + data['data'][0]['personal_emails']);
      setPphone("" + data['data'][0]['phone_numbers']);
      setPfacebook_id("" + data['data'][0]['facebook_id']);
      setPfacebook_url("" + data['data'][0]['facebook_url']);
      setPfacebook_un("" + data['data'][0]['facebook_username']);

      setPlinkdin_id("" + data['data'][0]['linkedin_id']);
      setPlinkdin_url("" + data['data'][0]['linkedin_url']);
      setPlinkdin_un("" + data['data'][0]['linkedin_username']);

      setPtwitter_url("" + data['data'][0]['twitter_url']);
      setPtwitter_un("" + data['data'][0]['twitter_username']);

      setIsSearchResult(true);

    }).catch((error) => {
      setContent('No Search Result');
      setIsSearchResult(false)
      console.log(error);
    });
  }
  const clearCompanyData = () => {
    setBid('');
    setBname('');
    setBfounded(0);
    setBindustry('');
    setBwebsite('');
    setBsummary('');

    setBlinkdin('');
    setBfacebook('');
    setBtwitter('');
    setCrunchbase('');
  }
  const getCompanyData = (ticker: string, name: string, website: string) => {

    clearCompanyData();
    const query = makeCompanyQuery(name, ticker, website);

    PDLJSClient.company.search.sql({
      searchQuery: query,
      size: 10,
    }).then((data) => {
      console.log(data);
      setBid(data['data'][0].id as string);
      setBname(data['data'][0].name as string);
      setBfounded(data['data'][0].founded as number);
      setBindustry(data['data'][0].industry as string);
      setBwebsite(data['data'][0].website as string);
      setBsummary(data['data'][0].summary as string);

      setBlinkdin(data['data'][0].linkedin_url as string);
      setBfacebook(data['data'][0].facebook_url as string);
      setBtwitter(data['data'][0].twitter_url as string);
      setCrunchbase((data['data'][0].profiles)?.at(4) as string);

      setIsSearchResult(true);

    }).catch((error) => {
      setContent('No Search Result');
      setIsSearchResult(false);
      console.log(error);
    });


  }

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

  const handleName = (name: string) => {
    setName(name);
  }
  const handleDescription = (des: string) => {
    setDescription(des);
  }

  const manageData = (data: Geo) => {
    setData(data);
  };
  const manageAllData = (data: Geo) => {
    setAllData(prevNames => [...prevNames, data])
  };
  const manageCsvData = (data: any) => {
    setCsvData(prevNames => [...prevNames, data])
  }
  const deleteData = (pointName: string) => {
    setAllData(allData.filter(item => item.name !== pointName));
    // alert('deleted')
  }
  const editData = (pointName: string, data: any) => {

    console.log(data.name);
    console.log(data);

    let updatedList = allData.map(item => {
      if (item.name == pointName) {
        return { ...item, name: data.name, description: data.description, lat: data.latitude, lng: data.longtitude }; //gets everything that was already in item, and updates "done"
      }
      return item; // else return unmodified item 
    });

    setAllData(updatedList);
  }

  const myMap = useMap(mapRef, name, description, lat, lng, addFlag, editFlag, dataLayerFlag, "mapbox://styles/mapbox/satellite-streets-v12", handleLongtitude, handleLatitude, handleName, handleDescription, deleteData, editData, geoStyleName, layer, array, geodata, drawMode, toggle, deleteFlag)

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
            if (pbVisible) setPbVisible(0);
            else setPbVisible(1);
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
          background: "transparent",
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
            <Tabs value={value_tab_draw} onChange={handleTabDrawChange} aria-label="basic tabs example" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tab label="Rect" {...a11yProps_Draw(0)} style={{ color: "white", minWidth: '0px' }}
                onClick={() => {
                  setDrawMode('RECT');
                  handleToggle();
                }} />
              <Tab label="Circle" {...a11yProps_Draw(1)} style={{ color: "white", minWidth: '0px' }}
                onClick={() => {
                  setDrawMode('Circle');
                  handleToggle();
                }} />
              <Tab label="poly" {...a11yProps_Draw(2)} style={{ color: "white", minWidth: '0px' }}
                onClick={() => {
                  setDrawMode('Polygon');
                  handleToggle();
                }} />
            </Tabs>
          </Box>
          <TabPanel_Draw value={value_tab_draw} index={0} >

            <div className='drawTab'>
              <div style={{ paddingBottom: "10px" }}>
                Properties
              </div>

              <div style={{ display: "flex" }}>

                <input type="text" placeholder='point' style={{ borderColor: "white", width: '100%' }} />
              </div>
              <div style={{ display: "flex" }}>

                <input type="text" placeholder='width' style={{ borderColor: "white", width: '100%' }} />
              </div>
              <div style={{ display: "flex" }}>
                <input type="text" placeholder='height' style={{ borderColor: "white", width: '100%' }} />
              </div>
            </div>
          </TabPanel_Draw>
          <TabPanel_Draw value={value_tab_draw} index={1}>
            <div className='drawTab'>
              <div style={{ paddingBottom: "10px" }}>
                Properties
              </div>
              <div style={{ display: "flex" }}>

                <input type="text" placeholder='point' style={{ borderColor: "white", width: '100%' }} />
              </div>
              <div style={{ display: "flex" }}>
                <input type="text" placeholder='radius' style={{ borderColor: "white", width: '100%' }} />
              </div>
            </div>
          </TabPanel_Draw>
          <TabPanel_Draw value={value_tab_draw} index={2}>
            <div className='drawTab'>
              <div style={{ paddingBottom: "10px" }}>
                Properties
              </div>
              <div style={{ display: "flex" }}>
                <input type="text" placeholder='count' style={{ borderColor: "white", width: '100%' }} />
              </div>
              <div style={{ display: "flex" }}>


                <textarea placeholder='polygon vertex (X,Y) coordinate' style={{ borderColor: "white", height: "85px", width: "100%" }} />
              </div>
            </div>
          </TabPanel_Draw>
          <button className='geoStyleBtn' style={{ marginLeft: '20px' }}>Search</button>
        </Box>
      </div>

      {/* ---------------------------Point Data layout ----------------------- */}
      {/* <div style={{
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
              // manageData({ description, name, lat, lng });
              manageAllData({ description, name, lat, lng });
              console.log(data);
            }} />
            <input type="button" value={"Edit"} onClick={() => {
              setEditFlag(!editFlag);

            }} />
            <input type="button" value={"Delete"} onClick={() => {
              setDeleteFlag(!deleteFlag);
            }} />
          </div>

        </form>
      </div> */}

      <div style={{
        position: "fixed",
        right: "0%",
        zIndex: "1",
        width: '20%',
        height: '94%',
        opacity: 0.75,
        background: 'black'
      }}>

        <div>
          <button style={{
            position: 'absolute',
            width: '40px',
            height: '30px',
            marginLeft: '-40px',
            top: '50%',
            background: 'black',
            opacity: '0.75',
            color: 'white'
          }}>H/V</button>
        </div>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value_tab_dv} onChange={handleTabDVChange} aria-label="basic tabs example">
              <Tab label="Layer" {...a11yProps_DV(0)} style={{ color: "white", width: '50%' }} onClick={() => { setDvMode('layer') }}
              />
              <Tab label="Data" {...a11yProps_DV(1)} style={{ color: "white", width: '50%' }} onClick={() => { setDvMode('table') }}
              />
            </Tabs>
          </Box>
          <TabPanel_PB value={value_tab_dv} index={0} >
            <List style={{background: 'black', padding : '7%', maxWidth:'100%'}} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start" style={{textAlign:'center', alignItems:'center', color: 'white'}}>
                <ListItemAvatar>
                  <Avatar style={{width:'100%', height:'120px', borderRadius: '10px'}} alt="Remy Sharp" src={assets.images.logo} />
                </ListItemAvatar>
                <ListItemText
                style={{marginLeft: '15px'}}
                  primary="Vessel"
             
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start"  style={{textAlign:'center', alignItems:'center', color: 'white'}}>
                <ListItemAvatar>
                <Avatar style={{width:'100%', height:'120px', borderRadius: '10px'}} alt="Remy Sharp" src={assets.images.logo} />
                </ListItemAvatar>
                <ListItemText
                style={{marginLeft: '15px'}}
                  primary="Company"
                 
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start"  style={{textAlign:'center', alignItems:'center', color: 'white'}}>
                <ListItemAvatar>
                <Avatar style={{width:'100%', height:'120px', borderRadius: '10px'}} alt="Remy Sharp" src={assets.images.logo} />
                </ListItemAvatar>
                <ListItemText
                style={{marginLeft: '15px'}}
                  primary="People"
                 
                />
              </ListItem>
            </List>

          </TabPanel_PB>
          <TabPanel_PB value={value_tab_dv} index={1}>
            <div>
              <div style={{
                color: 'white',
                textAlign: 'center',
                padding: '20px'
              }}>Data Table</div>
              <div className='' style={{
                position: 'absolute',
                right: "0px",
                zIndex: "1",
                background: "black",
                opacity: "0.75",
                color: "white",
                height: "85%",
                padding: "5px",
                width: '100%',
              }}>
                <table className='large-2' style={{
                  textAlign: "center",
                  width: "100%",
                  overflowY: 'scroll',
                  display: 'block',
                  height: "100%"
                }}>
                  <thead style={{ top: '0', position: 'sticky', background: 'gray' }}>
                    <tr style={{}}>
                      {csvHeader.map((data, index) => {
                        return (
                          <td style={{ textAlign: 'center' }}>{data}</td>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((data, index) => {
                      return (
                        <tr style={{}}>
                          {csvHeader.map((header, index) => {
                            return (
                              <td style={{ textAlign: 'center', padding: '10px' }}>{data[header]}</td>
                            );
                          })}
                        </tr>
                      );
                    })}

                  </tbody>
                </table>

              </div>
            </div>

          </TabPanel_PB>

        </Box>

      </div>

      {/* -------------------------   P&B layout --------------------- */}

      <div className='PDdata' style={pbVisible ? { display: "none" } :
        {
          position: "absolute",
          right: "25%",
          marginTop: "7%",

          zIndex: "1",
          width: "50%",
          height: "650px",
          backgroundColor: "black",
          display: 'flex',
          flexDirection: 'row',
          borderRadius: '10px',
          opacity: '0.75'
        }}
      >
        <div style={{
          width: "30%", height: "100%", borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px',
          borderRight: '0.1rem solid white'
        }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value_tab_pb} onChange={handleTabPBChange} aria-label="basic tabs example">
                <Tab label="Person" {...a11yProps_PB(0)} style={{ color: "white", width: '50%' }} onClick={() => { setPbMode('person') }}
                />
                <Tab label="company" {...a11yProps_PB(1)} style={{ color: "white", width: '50%' }} onClick={() => { setPbMode('company') }}
                />
              </Tabs>
            </Box>
            <TabPanel_PB value={value_tab_pb} index={0} >

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
            </TabPanel_PB>
            <TabPanel_PB value={value_tab_pb} index={1}>
              <div className='drawTab'>
                <div style={{ paddingBottom: "10px" }}>

                </div>

                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Name' value={cName} onChange={(e) => { setCName(e.target.value) }} style={{ width: '100%', borderColor: "white" }} />
                </div>

                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Ticker' value={cticker} onChange={(e) => { setCticker(e.target.value) }} style={{ width: '100%', borderColor: "white" }} />
                </div>
                <div style={{ display: "flex" }}>
                  <input type="text" placeholder='Website' value={cWebsite} onChange={(e) => { setCWebsite(e.target.value) }} style={{ width: '100%', borderColor: "white" }} />
                </div>
              </div>

            </TabPanel_PB>

            <button className='geoStyleBtn' style={{ marginLeft: '20px' }}
              onClick={() => {
                if (pbMode === 'person')
                  getPersonData();
                else if (pbMode === 'company') getCompanyData(cticker, cName, cWebsite);
              }}
            >Search</button>
            <button className='geoStyleBtn' style={{ marginLeft: '20px' }}
              onClick={() => {


                handleGeneratePdf();
              }}
            >Download</button>
          </Box>
          <div style={{ textAlign: 'center', marginTop: '170px', color: 'white' }}>
            {isSearchResult ? (
              <div>

              </div>
            ) :
              (<div>
                {content}
              </div>)
            }

          </div>
        </div>
        <div style={{ width: '70%', height: '100%', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
          <div className='PBData' style={{ color: 'white', height: '100%' }}>


            {(pbMode === 'person') ? (
              <div>
                <div style={{ fontSize: '24px', lineHeight: '45px', width: '100%', height: '50px', textAlign: 'center', paddingTop: '10px' }}>
                  Identity Details
                </div>
                <div style={{ padding: "20px" }} ref={reportTemplateRef}>
                  <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '5px', borderBottom: '0.05em solid', borderTop: '0.05em solid' }}>

                    PERSONAL INFORMATION
                    <br />

                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', padding: '15px' }}>
                    <div style={{ width: '10%', marginLeft: '3%' }}>
                      ID:<br />Name:<br />Address:<br />Emails:<br />Phone:
                    </div>
                    <div style={{ marginLeft: '25px' }}>
                      <div>{pid}</div>
                      <div>{pname}</div>
                      <div>{paddress}</div>
                      <div>{pemail}</div>
                      <div>{pphone}</div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '5px', borderBottom: '0.05em solid', borderTop: '0.05em solid' }}>

                    SOCIAL MEDIA INFORMATION
                    <br />
                  </div>
                  <div style={{ padding: '15px' }}>
                    <div >
                      <div style={{ marginLeft: '3%' }}>Facebook:</div>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '10%', marginLeft: '5%', padding: '10px', fontSize: '14px' }}>
                          ID:<br />URL:<br />Username:
                        </div>
                        <div style={{ padding: '10px', marginLeft: '25px', fontSize: '14px' }}>
                          <div>{pfacebook_id}</div>
                          <div>{pfacebook_url}</div>
                          <div>{pfacebook_un}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ marginLeft: '3%' }}>LinkedIn:</div>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '10%', marginLeft: '5%', padding: '10px', fontSize: '14px' }}>
                          ID:<br />URL:<br />Username:
                        </div>
                        <div style={{ padding: '10px', marginLeft: '25px', fontSize: '14px' }}>
                          <div>{plinkdin_id}</div>
                          <div>{plinkdin_url}</div>
                          <div>{plinkdin_un}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ marginLeft: '3%' }}>Twitter:</div>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '10%', marginLeft: '5%', padding: '10px', fontSize: '14px' }}>
                          URL:<br />Username:
                        </div>
                        <div style={{ padding: '10px', marginLeft: '25px', fontSize: '14px' }}>
                          <div>{ptwitter_url}</div>
                          <div>{ptwitter_un}</div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>

            ) : (
              <div>
                <div style={{ fontSize: '24px', lineHeight: '45px', width: '100%', height: '50px', textAlign: 'center', paddingTop: '10px' }}>
                  Company Details.
                </div>
                <div style={{ padding: "20px" }} ref={reportTemplateRef}>
                  <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '5px', borderBottom: '0.05em solid', borderTop: '0.05em solid' }}>

                    BUSINESS INFORMATION
                    <br />

                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', padding: '15px' }}>
                    <div style={{ width: '10%', marginLeft: '3%' }}>
                      ID:<br />Name:<br />Founded:<br />Industry:<br />Website:<br />Summary:
                    </div>
                    <div style={{ marginLeft: '25px' }}>
                      <div>{bid}</div>
                      <div>{bname}</div>
                      <div>{bfounded}</div>
                      <div>{bindustry}</div>
                      <div>{bwebsite}</div>
                      <div>{bsummary}</div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 'bold', textAlign: 'center', padding: '5px', borderBottom: '0.05em solid', borderTop: '0.05em solid' }}>

                    SOCIAL MEDIA INFORMATION
                    <br />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', padding: '15px' }}>
                    <div style={{ width: '10%', marginLeft: '3%' }}>
                      Linkdlin:<br />Facebook:<br />Twitter:<br />Crunch:
                    </div>
                    <div style={{ marginLeft: '25px' }}>
                      <div>{blinkdin}</div>
                      <div>{bfacebook}</div>
                      <div>{btwitter}</div>
                      <div>{bcrunchbase}</div>
                    </div>
                  </div>


                </div>
              </div>
            )}

          </div>
        </div>
      </div>


      {/* ------------------------- Geo Point Table layout-------------------- */}
      {/* <div style={dataVisible ? { display: "none" } : {
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
            <tr style={{}}>
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
          style={{
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
            <input id="Image" type="file" onChange={OpenCSVFile} />
            Import CSV
          </label>
          
          <CSVLink data={allData} style={{ width: '40%' }}><button className='csv' style={{ height: '33px', fontSize: '15px', width: '100%' }}>Export CSV</button></CSVLink>
        </div>
      </div> */}

      {/* -----------------------------import various csv , Data layer  */}
      <div className='' style={dataVisible ? { display: "none" } :
        {
          position: "absolute",
          right: "25%",
          marginTop: "7%",
          zIndex: "2",
          width: "50%",
          height: "650px",
          display: 'flex',
          // display : 'none',
          backgroundColor: "black",
          borderRadius: '10px',
          opacity: '0.75'
        }}
      >
        <div style={{
          width: "30%", height: "100%", borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px',
          borderRight: '0.1rem solid white'
        }}>
          <div className='PBData' style={{ color: 'white', height: '100%' }}>
            <div>
              <div style={{ fontSize: '24px', lineHeight: '45px', width: '100%', height: '50px', textAlign: 'center', paddingTop: '10px' }}>
                Options
              </div>
              <div className='drawTab'>

                <div style={{ display: "flex", marginTop: '35px' }}>
                  <input type="text" placeholder='Enter a layer name' value={layer} onChange={(e) => { setLayer(e.target.value) }} style={{ width: '100%', borderColor: "white" }} />
                </div>
                <div style={{ fontSize: '16px', lineHeight: '45px', width: '100%', height: '50px', textAlign: 'center', paddingTop: '10px' }}>
                  Layers
                </div>
                <div style={{
                  width: '100%',
                  height: '300px',
                  border: '0.1rem solid white',
                  borderRadius: '10px'
                }}>
                  <ul style={{ width: '100%', height: '100%' }}>
                    {dataLayers.map((data, index) => {
                      return (
                        <li style={{ padding: '10px' }}>
                          {data}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div
                  style={{
                    // display: "block",
                    position: "absolute",
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: "space-evenly",
                    paddingTop: "5px",
                    zIndex: '1',
                    width: "25%",
                    marginBottom: "4%",
                    bottom: "0"
                    // overflowY: 'scroll'
                  }}>
                  <label className='csv'>
                    <input id="Image" type="file" onChange={readCSVFile} />
                    Import CSV
                  </label>
                  {/* <label className='csv'>
            Export CSV
          </label> */}
                  <label className='csv' onClick={() => {
                    setDataLayers(layers => [...layers, layer])
                    setDataLayerFlag(!dataLayerFlag);
                  }}>
                    Add layer
                  </label>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div style={{ width: '70%', height: '100%', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
          <div className='PBData' style={{ color: 'white', height: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}>

              <div style={{ fontSize: '24px', lineHeight: '45px', width: '100%', height: '50px', textAlign: 'center', paddingTop: '10px' }}>
                Preview CSV Data
              </div>
              <table className='large-2' style={{
                // textAlign: "center",
                width: "100%",
                height: '92.5%',
                display: 'table-cell',
                overflow: 'scroll'
                // height: "100%"
              }}>
                <thead style={{ background: 'gray', position: 'sticky', top: '0' }}>
                  <tr style={{}}>
                    {csvHeader.map((data, index) => {
                      return (
                        <td style={{ textAlign: 'center' }}>{data}</td>
                      );
                    })}
                  </tr>
                </thead>
                <tbody style={{}}>
                  {csvData.map((data, index) => {
                    return (
                      <tr style={{}}>
                        {csvHeader.map((header, index) => {
                          return (
                            <td style={{ textAlign: 'center', padding: '10px' }}>{data[header]}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>


      <div ref={mapRef} className='map' style={{ padding: "0px !important", height: "94%", width: "100%" }} />

    </>


  )
};

export default SatelitteMap;


