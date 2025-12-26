import { Box, TextField, Typography } from "@mui/material";
import "./signup.css";
import { FmButton2 } from "../../utils/buttons";
import { GoogleSvgIcon } from "../../utils/svg-components";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { NewUser } from "../../interfaces";
import { signUp } from "../../service/user.service";
import PasswordValidator from "password-validator";
import { SmallText } from "../../utils/custom-elements";

const schema = new PasswordValidator();

schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

const SignupComponent = () => {
  const { t } = useTranslation();
  const { googleLogin } = useUser();

  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
  });

  const [password2, setPassword2] = useState<string>("");
  const [formFilled, setFormFilled] = useState<boolean>(false);

  useEffect(() => {
    checkForm();
  }, [newUser, password2]);

  const checkForm = () => {
    if (
      password2 === newUser.password &&
      newUser.name !== "" &&
      newUser.email !== "" &&
      newUser.password !== "" &&
      schema.validate(password2)
    ) {
      setFormFilled(true);
      return true;
    }
    setFormFilled(false);
    return false;
  };

  const signup = async () => {
    if (checkForm()) {
      const res = await signUp(newUser);
      alert(res.data.message);
    }
  };
  return (
    <Box id="signup-wrapper">
      <Box id="signup-container">
        <TextField
          variant="outlined"
          value={newUser.name}
          label={t("*Name")}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewUser({ ...newUser, name: event.target.value });
          }}
        />
        <TextField
          variant="outlined"
          value={newUser.email}
          label={t("*Email")}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewUser({ ...newUser, email: event.target.value });
          }}
        />
        <TextField
          variant="outlined"
          type="password"
          value={newUser.password}
          label={t("*Password")}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewUser({ ...newUser, password: event.target.value });
          }}
        />
        <TextField
          variant="outlined"
          type="password"
          value={password2}
          label={t("*Confirm Password")}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword2(event.target.value);
          }}
        />
        <Box id="password-requirement" sx={{ maxWidth: "300px" }}>
          <SmallText>{t("Password requirements:")}</SmallText>
          <SmallText>{"- " + t("Min. 8 characters")}</SmallText>
          <SmallText>
            {"- " + t("Include lower and upper case letters")}
          </SmallText>
          <SmallText>{"- " + t("Include number")}</SmallText>
        </Box>
        <FmButton2
          id="signup-button"
          className={formFilled ? "" : "signup-button-disabled"}
          onClick={signup}
        >
          {t("Sign Up")}
        </FmButton2>
        <Typography sx={{ textAlign: "center" }}>{t("or")}</Typography>
        <FmButton2 onClick={() => googleLogin()}>
          <GoogleSvgIcon />
          <Box id="login-button-text">{t("Sign up with google")}</Box>
        </FmButton2>
      </Box>
    </Box>
  );
};
export default SignupComponent;
