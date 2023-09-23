import React from "react";
import ReactDOM from "react-dom/client";
import AppLogin from "../appsForPages/login/AppLogin.tsx";
import AppTool from "../appsForPages/tool/AppTool.tsx";
import AppAdminSetup from "../appsForPages/adminSetup/AppAdminSetup.tsx";
declare global {
  interface Window {
    APP: string;
  }
}
const map: Record<string, any> = {
  login: AppLogin,
  tool: AppTool,
  adminSetup: AppAdminSetup,
};
const App = map[window.APP];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
