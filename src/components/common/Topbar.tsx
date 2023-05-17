import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import "./index.css"
const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      style={{background: "black"}}
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor : "black",
        // backgroundColor: colorConfigs.topbar.bg,
        // color: colorConfigs.topbar.color,
        color : "white",
        minHeight : "0px"
      }}
    >
      <Toolbar >
        <Typography variant="h6" style={{background : "black"}}>
            Geospatial Mapping Software
        </Typography>
        
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;