import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        // backgroundColor : "white",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        minHeight : "0px"
      }}
    >
      {/* <Toolbar>
        <Typography variant="h6">
        Geospatial Mapping Software
        </Typography>
      </Toolbar> */}
    </AppBar>
  );
};

export default Topbar;