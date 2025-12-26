import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Slide,
  Alert,
  AlertProps,
  Snackbar,
  ListItemText,
  List,
  ListSubheader,
  ListItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../UserContext";
import { FMProfile } from "../../interfaces";
import { updateUserProfile } from "../../service/user.service";
import React from "react";
import { useTranslation } from "react-i18next";
import "./account.css";
import i18next, { use } from "i18next";
import { useEquipment } from "../../EquipmentContext";
import { SecondaryText } from "../../utils/custom-elements";
import { useAlert } from "../../AlertContext";
import { set } from "date-fns";
import { useLanguage } from "../../LanguageContext";

const AccountInfoComponent = () => {
  const { t } = useTranslation();
  const { user, setUser } = useUser();
  const { equipment } = useEquipment();
  const { showAlert } = useAlert();
  const { setLanguage } = useLanguage();

  const labels = {
    name: i18next.t("Name"),
    email: i18next.t("Email"),
    language: i18next.t("Preferred language"),
    role: i18next.t("Role"),
  };
  const [userInfo, setUserInfo] = useState<Partial<FMProfile>>({
    id: "",
    name: "",
    language: "en",
  });

  // When page is loaded, check if admin is browsing other user than self
  useEffect(() => {
    if (user) setUserInfo(user);
  }, [user]);

  const handleChangeInfo = (event: any) => {
    const { name, value } = event.target;
    if (userInfo[name as keyof FMProfile] === value) return;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
    // handleSaveUser({ key: name, value });
  };

  const handleSaveUser = async (prop: { key: string; value: any }) => {
    const { key, value } = prop;
    if (user && user[key as keyof FMProfile] === value) return;
    const { id } = userInfo;
    const newUserData: Partial<FMProfile> = {
      id,
      [key]: value,
    };

    try {
      const { message } = await updateUserProfile(
        newUserData as Partial<FMProfile>
      );
      showAlert({ severity: "success", message });
      setUserInfo({ ...userInfo, [key]: value });
    } catch (error) {
      if (error instanceof Error) {
        showAlert({ severity: "error", message: error.message });
      } else {
        showAlert({
          severity: "error",
          message: "An unknown error occurred",
        });
      }
    }
  };

  const handleChangeLanguage = async (event: any) => {
    const { value } = event.target;
    if (userInfo.language === value) return;
    handleChangeInfo(event);
    handleSaveUser({ key: "language", value });
    i18next.changeLanguage(value);
    setLanguage(value);
  };

  return (
    <React.Fragment>
      <Box id="account-info-wrapper">
        <Box id="account-info-header">
          <Box>{t("Account info")}</Box>
          <Box id="last-login-box">
            <SecondaryText text={`Last login: ${userInfo.last_login}`} />
          </Box>
        </Box>
        <Divider />
        <Box id="account-info-box">
          <TextField
            className="account-info-input"
            name="name"
            label={labels.name}
            value={userInfo?.name || ""}
            onChange={handleChangeInfo}
            onBlur={() => handleSaveUser({ key: "name", value: userInfo.name })}
            variant="standard"
          />
          <TextField
            className="account-info-input"
            name="email"
            label={labels.email}
            value={userInfo?.email || ""}
            variant="standard"
            inputProps={{ readOnly: true }}
          />
          <TextField
            className="account-info-input"
            name="role"
            label={labels.role}
            value={userInfo?.role || ""}
            variant="standard"
            inputProps={{ readOnly: true }}
          />

          <FormControl fullWidth className="account-info-input">
            {/* <InputLabel id="language-select-label">
              {labels.language}
            </InputLabel> */}
            <Select
              sx={{ marginTop: "10px" }}
              variant="standard"
              labelId="language-select-label"
              id="language-select-input"
              value={userInfo?.language}
              label={labels.language}
              name="language"
              // onChange={handleChangeInfo}
              onChange={(e) => handleChangeLanguage(e)}
            >
              <MenuItem value={"en"}>{t("English")}</MenuItem>
              <MenuItem value={"sv"}>{t("Svenska")}</MenuItem>
              <MenuItem value={"fi"}>{t("Suomi")}</MenuItem>
            </Select>
          </FormControl>
          {/* <FmButton2 id="account-save-button" onClick={handleClickSave}>
            {t("save")}
          </FmButton2> */}
        </Box>
        <Box id="account-info-box-2">
          <List
            dense
            sx={{ width: "100%", maxWidth: 360 }}
            subheader={
              <ListSubheader sx={{ background: "none", padding: "0" }}>
                {t("Access")}
              </ListSubheader>
            }
          >
            {equipment &&
              Object.values(equipment)
                .filter(
                  (itemObj) =>
                    user && user.access.split(",").includes(itemObj.typeName)
                )
                .map((itemObj) => (
                  <React.Fragment key={itemObj.typeName}>
                    <ListItem
                      sx={{ padding: "0", textDecoration: "underline" }}
                    >
                      <ListItemText primary={itemObj.typeName} />
                    </ListItem>
                    {itemObj.names
                      .filter((nameObj: { name: string }) =>
                        user?.access.split(",").includes(nameObj.name)
                      )
                      .map((nameObj: { name: string }) => (
                        <ListItem
                          key={nameObj.name}
                          sx={{ padding: "0", pl: 4 }}
                        >
                          <ListItemText primary={nameObj.name} />
                        </ListItem>
                      ))}
                  </React.Fragment>
                ))}
          </List>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default AccountInfoComponent;
