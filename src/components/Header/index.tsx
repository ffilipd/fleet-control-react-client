import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FMLogoWhite,
  FleetControlLogoTextWhite,
  FleetControlTextWhite,
  HssFleetLogo2,
} from "../../utils/svg-components";
import "./header.css";
import { useTranslation } from "react-i18next";
import { FmButton } from "../../utils/buttons";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardControlKeyIcon from "@mui/icons-material/KeyboardControlKey";
// import LanguageSharpIcon from "@mui/icons-material/LanguageSharp";
// import LoginSharpIcon from "@mui/icons-material/LoginSharp";
import { useNavigate } from "react-router-dom";
import MobileDrawer from "./MobileDrawer";
import i18next from "i18next";
import { useUser } from "../../UserContext";
import { useAlert } from "../../AlertContext";
import { useLanguage } from "../../LanguageContext";

function Header() {
  const languages = {
    en: "English",
    sv: "Svenska",
    fi: "Suomi",
  };

  // const [language, setLanguage] = useState<string>("en");
  const { user, logOut, googleLogin } = useUser();
  const { t } = useTranslation();
  const { alertProps, alertVisible } = useAlert();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [userMenuAnchorEl, setUserMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  const { showAlert } = useAlert();
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  // // Update page when language changes
  // useEffect(() => {
  //   i18next.changeLanguage(language);
  // }, [language]);

  useEffect(() => {
    if (user?.language) {
      i18next.changeLanguage(user.language);
      setLanguage(user.language);
    }
  }, [user]);

  const accountMenuOpen = Boolean(userMenuAnchorEl) || false;
  const adminMenuOpen = Boolean(adminMenuAnchorEl) || false;

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18next.changeLanguage(newLanguage);
  };
  function handleAccountMenuClose(e: any) {
    /* eslint-disable */
    e.target.value === 0
      ? null // @TODO: Implement account details fn here!
      : null;
    setUserMenuAnchorEl(null);
  }
  function handleAdminMenuClose(e: any) {
    setAdminMenuAnchorEl(null);
  }

  const handleAdminItemClick = (e: any) => {
    const target = e.target.value;
    setAdminMenuAnchorEl(null);

    // Equipment
    if (target === 1) {
      navigate("/admin/equipment");
    }
    // Users
    if (target === 2) {
      navigate("/admin/users");
    }
    // Talkoo points
    if (target === 3) {
      navigate("/admin/talkoo");
    }
  };

  function handleUserManagement() {
    navigate("/users");
  }

  function handleLogout() {
    logOut();
    navigate("/");
  }

  function handleAccountMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
    setUserMenuAnchorEl(e.currentTarget);
  }
  function handleAdminMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
    setAdminMenuAnchorEl(e.currentTarget);
  }

  const handleAccountInfoClick = (event: any) => {
    handleAccountMenuClose(event);
    navigate(`/accountinfo?id=${user?.id}`);
  };

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuItemClick = (clickedItem: any) => {
    console.log("clickedItem", clickedItem);
    setDrawerOpen(false);
    if (clickedItem === "Home") {
      showAlert({
        severity: "info",
        message: "Home button clicked!",
      });
    }
    // if (clickedItem === "Home") navigate("/");
    if (clickedItem === "Book equipment") navigate("/booking");
    if (clickedItem === "Report") navigate("/report");
    if (clickedItem === "My Bookings") navigate("/mybookings");
    if (clickedItem === "Accountinfo") navigate("/accountinfo");
    if (clickedItem === "Login") navigate("/login");
    if (clickedItem === "Logout") handleLogout();
  };

  const handleAdministrationClick = () => {
    navigate("/administration");
  };

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    const splitName = name.split(" ").length > 1 ? true : false;
    const children = splitName
      ? `${name?.split(" ")[0][0]}${name?.split(" ")[1][0]}`
      : name[0];
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: children,
    };
  }

  return (
    <Box id="header-wrapper">
      <Slide
        direction="down"
        in={alertVisible}
        mountOnEnter
        unmountOnExit
        easing={"exit: theme.transitions.easing.sharp"}
      >
        <Alert
          severity={alertProps.severity}
          sx={{
            margin: "0",
            position: "absolute",
            top: "120px",
            left: "0",
            width: "100%",
            overflow: "ease",
          }}
        >
          {alertProps.message}
        </Alert>
      </Slide>
      {isMobile === false && (
        <Box id={"fm-logo"}>
          <FMLogoWhite />
        </Box>
      )}
      <Box id="header-and-buttongroup">
        <Box id="header-text">
          <FleetControlTextWhite />
        </Box>
        {isMobile ? (
          <MobileDrawer
            isOpen={drawerOpen}
            toggleDrawer={toggleDrawer}
            language={language}
            languages={languages}
            updateLanguage={updateLanguage}
            handleMenuItemClick={handleMenuItemClick}
            user={user}
          />
        ) : (
          <ButtonGroup
            id="button-group"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              // border: "1px solid white",
            }}
            variant="outlined"
            aria-label="header button group"
          >
            <Box sx={{ display: "flex", alignSelf: "flex-end" }}>
              <FmButton onClick={() => navigate("/")}>{t("Home")}</FmButton>
              <FmButton onClick={() => navigate("/report")}>
                {t("Report")}
              </FmButton>
              <FmButton onClick={() => navigate("/booking")}>
                {t("Book equipment")}
              </FmButton>
              <FmButton onClick={() => navigate("/mybookings")}>
                {user?.role === "admin" || user?.role === "moderator"
                  ? t("Bookings")
                  : t("My Bookings")}
              </FmButton>
            </Box>
            <Box sx={{ display: "flex" }} id="right-button-group">
              {user?.role === "admin" && (
                <>
                  <Button
                    className="login-header-btn"
                    aria-controls={adminMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="false"
                    aria-expanded={adminMenuOpen ? "true" : undefined}
                    onClick={handleAdminMenuClick}
                  >
                    {t("Administration")}
                    {adminMenuOpen ? (
                      <KeyboardControlKeyIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </Button>
                  <Menu
                    anchorEl={adminMenuAnchorEl}
                    open={adminMenuOpen}
                    onClose={handleAdminMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "account-button",
                    }}
                  >
                    <MenuItem value={1} onClick={handleAdminItemClick}>
                      {t("Equipment")}
                    </MenuItem>
                    <MenuItem value={2} onClick={handleAdminItemClick}>
                      {t("Users")}
                    </MenuItem>
                  </Menu>
                </>
              )}
              {user ? (
                <>
                  <Button
                    className="login-header-btn"
                    aria-controls={accountMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="false"
                    aria-expanded={accountMenuOpen ? "true" : undefined}
                    onClick={handleAccountMenuClick}
                  >
                    <Avatar {...stringAvatar(user.name)} />
                    {/* {user.name} */}
                    {accountMenuOpen ? (
                      <KeyboardControlKeyIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </Button>
                  <Menu
                    anchorEl={userMenuAnchorEl}
                    open={accountMenuOpen}
                    onClose={handleAccountMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "account-button",
                    }}
                  >
                    <MenuItem onClick={handleAccountInfoClick}>
                      {t("Account info")}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
                  </Menu>
                </>
              ) : (
                <FmButton id="login-button" onClick={() => navigate("/login")}>
                  {t("Login")}
                </FmButton>
              )}
              <Select
                id="language-button"
                variant="outlined"
                className="select"
                sx={{
                  color: "#fff",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  ".MuiSvgIcon-root ": {
                    fill: "#fff",
                  },
                }}
                IconComponent={KeyboardArrowDownIcon}
                labelId="lang"
                value={language}
                startAdornment={
                  <InputAdornment position="start">
                    {/* <LanguageSharpIcon sx={{ color: "#fff" }} /> */}
                  </InputAdornment>
                }
                inputProps={{ style: { textTransform: "capitalize" } }}
                onChange={(e: SelectChangeEvent) =>
                  updateLanguage(e.target.value)
                }
              >
                {Object.entries(languages).map((lang) => (
                  <MenuItem key={`language-${lang[0]}`} value={lang[0]}>
                    {lang[1]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </ButtonGroup>
        )}
      </Box>
    </Box>
  );
}

export default Header;
