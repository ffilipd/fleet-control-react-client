import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { FmButton } from "../../utils/buttons";
import { useEffect, useState } from "react";
import { ExpandMore, ExpandLess, Key, Language } from "@mui/icons-material";
import { FMProfile, Languages } from "../../interfaces";
import React from "react";
import { useTranslation } from "react-i18next";

interface MobileDrawerProps {
  isOpen: boolean;
  language: string;
  languages: Languages;
  updateLanguage: (newLanguage: string) => void;
  toggleDrawer: (open: boolean) => (event: any) => void;
  handleMenuItemClick: (event: any) => void;
  user: FMProfile | null;
}

const MobileDrawer: React.FC<MobileDrawerProps> = (props) => {
  const {
    language,
    languages,
    updateLanguage,
    isOpen,
    toggleDrawer,
    handleMenuItemClick,
    user,
  } = props;
  const { t } = useTranslation();

  const [openLanguageCollapse, setOpenLanguageCollapse] =
    useState<boolean>(false);

  const handleExpandLanguageCollapse = () => {
    if (openLanguageCollapse) setOpenLanguageCollapse(false);
    else setOpenLanguageCollapse(true);
  };

  useEffect(() => {
    if (openLanguageCollapse) setOpenLanguageCollapse(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleDrawer]);

  return (
    <>
      <FmButton onClick={toggleDrawer(true)}>{t("Menu")}</FmButton>
      <Drawer
        id="drawer"
        transitionDuration={500}
        anchor="top"
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <List>
          {user ? (
            <>
              <ListItem>
                <ListItemButton onClick={() => handleMenuItemClick("Home")}>
                  <ListItemText primary={t("Home")} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={() => handleMenuItemClick("Report")}>
                  <ListItemText primary={t("Report")} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  onClick={() => handleMenuItemClick("Book equipment")}
                >
                  <ListItemText primary={t("Book equipment")} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={() => handleMenuItemClick("My Page")}>
                  <ListItemText primary={t("My Page")} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  onClick={() => handleMenuItemClick("Accountinfo")}
                >
                  <ListItemText primary={t("Account details")} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={() => handleMenuItemClick("Logout")}>
                  <ListItemText primary={t("Logout")} />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <ListItem>
              <ListItemButton onClick={() => handleMenuItemClick("Login")}>
                <ListItemText primary={t("Login")} />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem>
            <ListItemButton onClick={handleExpandLanguageCollapse}>
              <ListItemText primary={languages[language as keyof Languages]} />
              {openLanguageCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse
            id="language-collapse"
            in={openLanguageCollapse}
            timeout="auto"
            unmountOnExit
          >
            <List disablePadding>
              {Object.entries(languages).map((lang) => (
                <ListItemButton
                  key={lang[0]}
                  sx={{ pl: 4 }}
                  onClick={() => updateLanguage(lang[0])}
                >
                  <ListItemText>{lang[1]}</ListItemText>
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
