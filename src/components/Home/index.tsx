import { Box } from "@mui/material";
import { useState } from "react";
import { FmButtonCube } from "../../utils/buttons";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  const { t } = useTranslation();
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });
  return (
    <Box>
      <Box className="home-welcome-container">
        <h1 style={{ margin: "0 0 20px 0" }}>
          {t("Welcome to Fleet Control!")}
        </h1>
        <p>
          {t(
            "Fleet Control is a management platform for equipment that you can book and report usage and eventual damage. You can:"
          )}
        </p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>{t("Book equipment quickly and easily")}</li>
          <li>{t("Submit reports after usage and report any damage")}</li>
          <li>{t("Generate and view detailed usage reports")}</li>
          <li>{t("Check the status of your equipment")}</li>
        </ul>
        <p style={{ marginTop: "20px" }}>
          {t(
            "Navigate through the app using the buttons above to get started."
          )}
        </p>
      </Box>
    </Box>
  );
}

export default Home;
