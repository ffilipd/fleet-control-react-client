import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./oauth-config";
import { UserProvider } from "./UserContext";
import { EquipmentProvider } from "./EquipmentContext";
import { AlertProvider } from "./AlertContext";
import { LanguageProvider } from "./LanguageContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") ?? new Element()
);

root.render(
  <GoogleOAuthProvider clientId={config.googleOAuthClientId}>
    <UserProvider>
      <EquipmentProvider>
        <LanguageProvider>
          <Router>
            <I18nextProvider i18n={i18n} defaultNS={"translation"}>
              {/* <React.StrictMode> */}
              <AlertProvider>
                <App />
              </AlertProvider>
              {/* </React.StrictMode> */}
            </I18nextProvider>
          </Router>
        </LanguageProvider>
      </EquipmentProvider>
    </UserProvider>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
