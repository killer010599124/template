import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout";
import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import LightMap from "../pages/dashboard/LightMap";
import DashboardIndex from "../pages/dashboard/DashboardIndex";
import ChangelogPage from "../pages/changelog/ChangelogPage";
import DarkMap from "../pages/dashboard/DarkMap";
import StreetMap from "../pages/dashboard/StreetMap";
import SatelitteMap from "../pages/dashboard/SatelitteMap";
import ComponentPageLayout from "../pages/component/ComponentPageLayout";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AlertPage from "../pages/component/AlertPage";
import ButtonPage from "../pages/component/ButtonPage";
import InstallationPage from "../pages/installation/InstallationPage";
import DocumentationPage from "../pages/documentation/DocumentationPage";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <SatelitteMap />,
    state: "home",
  },
  // {
  //   path: "/installation",
  //   element: <InstallationPage />,
  //   state: "installation",
  //   sidebarProps: {
  //     displayText: "Installation",
  //     icon: <FileDownloadOutlinedIcon />
  //   }
  // },
  {
    path: "/dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Map Layers",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "dashboard.index",
      },
      {
        path: "/dashboard/light",
        element: <LightMap />,
        state: "dashboard.light",
        sidebarProps: {
          displayText: "Light",
        },
      },
      {
        path: "/dashboard/dark",
        element: <DarkMap />,
        state: "dashboard.dark",
        sidebarProps: {
          displayText: "Dark",
        },
      },
      {
        path: "/dashboard/street",
        element: <StreetMap />,
        state: "dashboard.street",
        sidebarProps: {
          displayText: "Street",
        },
      },
      {
        path: "/dashboard/satelitte",
        element: <SatelitteMap />,
        state: "dashboard.satelitte",
        sidebarProps: {
          displayText: "Satelitte Streets",
        },
      },
    ],
  },
  {
    path: "/documentation",
    element: <DocumentationPage />,
    state: "documentation",
    sidebarProps: {
      displayText: "Data Layers",
      icon: <ArticleOutlinedIcon />,
    },
  },
  {
    path: "/component",
    element: <ComponentPageLayout />,
    state: "component",
    sidebarProps: {
      displayText: "Tools",
      icon: <AppsOutlinedIcon />,
    },
    child: [
      {
        path: "/component/alert",
        element: <AlertPage />,
        state: "component.alert",
        sidebarProps: {
          displayText: "Draw Geofences",
        },
      },
      {
        path: "/component/button",
        element: <ButtonPage />,
        state: "component.button",
        sidebarProps: {
          displayText: "Extract Data",
        },
      },
    ],
  },

  // {
  //   path: "/changelog",
  //   element: <ChangelogPage />,
  //   state: "changelog",
  //   sidebarProps: {
  //     displayText: "Changelog",
  //     icon: <FormatListBulletedOutlinedIcon />
  //   }
  // }
];

export default appRoutes;
