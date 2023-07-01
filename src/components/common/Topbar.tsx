import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import "./index.css";
const Topbar = () => {
  return (
    <AppBar
      style={{ background: "transparent" }}
      sx={{
        width: `calc(100%)`,

        boxShadow: "unset",
        backgroundColor: "black",
        // backgroundColor: colorConfigs.topbar.bg,
        // color: colorConfigs.topbar.color,
        color: "white",
        minHeight: "0px",
      }}
    >
      <Toolbar style={{ background: "black", opacity: "0.7" }}></Toolbar>
      <Typography
        variant="h6"
        style={{
          color: "white",
          position: "absolute",
          marginTop: "10px",
          marginLeft: "100px",
          fontSize: "30px",
        }}
      >
        Geospatial Mapping Software
      </Typography>
    </AppBar>
  );
};

export default Topbar;
