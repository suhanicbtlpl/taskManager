import React from "react";
import { AppRoutes } from "../Routes/AppRoutes";
import "./Layout.css";
import { Sidebar } from "./sidebar/Sidebar";
import { BrowserRouter } from "react-router-dom";
export const Layout = () => {
  return (
    <div className="layout">
      <BrowserRouter>
      <Sidebar/>
      <div className="main-content">
        <AppRoutes/>
      </div>
      </BrowserRouter>
    </div>
  );
};