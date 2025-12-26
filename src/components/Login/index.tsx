import { Box, Divider, TextField, Typography } from "@mui/material";
import "./login.css";
import { FmButton2 } from "../../utils/buttons";
import { GoogleSvgIcon } from "../../utils/svg-components";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LoginCredentials } from "../../interfaces";
import { SecondaryText } from "../../utils/custom-elements";

const LoginComponent = () => {
  const { t } = useTranslation();
  const { credentialLogin, googleLogin } = useUser();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    name: "admin@fleetmad.com",
    password: "admin",
  });

  const handleCredentialLoginClick = () => {
    credentialLogin(credentials);
  };

  return (
    <Box id="login-wrapper">
      <Box id="login-container">
        <TextField
          variant="outlined"
          value={credentials.name}
          label={"*" + t("Email")}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCredentials({ ...credentials, name: event.target.value });
          }}
        />
        <TextField
          variant="outlined"
          type="password"
          value={credentials.password}
          label={t("*Password")}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCredentials({ ...credentials, password: event.target.value });
          }}
        />
        <FmButton2
          id="signup-button"
          // disabled={!formFilled}
          onClick={handleCredentialLoginClick}
        >
          {t("Sign in")}
        </FmButton2>
        <Typography sx={{ textAlign: "center" }}>{t("OR")}</Typography>
        <FmButton2 onClick={() => googleLogin()}>
          <GoogleSvgIcon />
          <Box id="login-button-text">{t("Sign in with google")}</Box>
        </FmButton2>
        <Divider sx={{ margin: "16px 0" }} />
        <Box sx={{ alignSelf: "center" }}>
          <SecondaryText text={t("Don't have an account yet?")} />
        </Box>
        <FmButton2 onClick={() => navigate("/signup")}>
          {t("Sign up")}
        </FmButton2>
      </Box>
    </Box>
  );
};
export default LoginComponent;
