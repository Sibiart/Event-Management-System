import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./components/Home";
import Venues from "./components/Venues";
import Vendors from "./components/Vendors";
import DJs from "./components/DJs";
import Artists from "./components/Artists";
import MyBookings from "./components/MyBookings";
import AuthPage from "./components/AuthPage";
import AdminPanel from "./components/AdminPanel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "venues", Component: Venues },
      { path: "vendors", Component: Vendors },
      { path: "djs", Component: DJs },
      { path: "artists", Component: Artists },
      { path: "my-bookings", Component: MyBookings },
      { path: "auth", Component: AuthPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminPanel,
  },
]);