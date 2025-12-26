import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
  Slide,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import React from "react";
import { FmButtonDanger } from "../../../../utils/buttons";
import { UserStaticCheckBoxes } from "./user-table";
import { FMProfile, UserRole } from "../../../../interfaces";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { TransitionProps } from "@mui/material/transitions";
import { updateUserProfile } from "../../../../service/user.service";
import { useAlert } from "../../../../AlertContext";

interface UsersDialogProps {
  showUserDetails: boolean;
  closeUserDetailsDialog: () => void;
  handleDeleteUserClick: () => void;
  setSelectedUser: (user: FMProfile) => void;
  user: FMProfile | null;
  equipmentTypes: string[];
  getEquipmentNames: (type: string) => string[];
  userRoles: UserRole[];
  selectedUser: FMProfile;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UsersDialog = (props: UsersDialogProps) => {
  const {
    showUserDetails,
    closeUserDetailsDialog,
    handleDeleteUserClick,
    setSelectedUser,
    user,
    equipmentTypes,
    getEquipmentNames,
    userRoles,
    selectedUser,
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleCheckboxClick = (event: React.SyntheticEvent<Element, Event>) => {
    const { name, checked } = event.target as HTMLInputElement;
    if (name === "active" || name === "rejected") {
      handleUpdateUser({ [name]: checked });
    }
    if (name === "type" || name === "name") {
      const item = (event.target as HTMLInputElement).id.split("-")[2];
      if (checked) {
        handleUpdateUser({
          access: selectedUser.access + "," + item,
        });
      } else {
        handleUpdateUser({
          access: selectedUser.access
            ?.replace(item, "")
            // Clean away any double commas left when removing a type
            .replace(/(^,)|(,$)/g, "")
            .replace(/,,+/g, ",")
            .replace(/^,/, "")
            .replace(/null/g, ""),
        });
      }
    }
  };

  const handleChangeUserRole = async (event: SelectChangeEvent<UserRole>) => {
    const selectedRole = event.target.value as UserRole;
    const currentRole = selectedUser?.role;
    if (selectedRole === currentRole) return;
    handleUpdateUser({ role: selectedRole });
  };

  const handleUpdateUser = async (props: Partial<FMProfile>) => {
    if (
      selectedUser &&
      selectedUser.id !== "12345" // dummy id, without this check it might try to update a non existing user
    ) {
      try {
        const res = await updateUserProfile({ ...props, id: selectedUser.id });
        setSelectedUser({ ...selectedUser, ...props });
        showAlert({
          severity: "success",
          message: res.message,
        });
        // setAlertVisible(true);
      } catch (err) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("An unknown error occurred");
        }
      }
      return;
    }
  };

  const { showAlert, alertProps, alertVisible } = useAlert();

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      open={showUserDetails}
      onClose={closeUserDetailsDialog}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "var(--color-theme-dark)",
        }}
      >
        <Toolbar sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => closeUserDetailsDialog()}
            aria-label="close"
            sx={{ fontSize: "1rem", flex: 1 }}
          >
            <KeyboardArrowLeftIcon fontSize="large" />
            {t("Back")}
          </IconButton>
          <Typography
            sx={{ alignItems: "center", width: "100%", textAlign: "center" }}
            variant="h6"
            component="div"
          >
            {t("Edit User")}
          </Typography>
        </Toolbar>
      </AppBar>
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
            top: "65px",
            width: "100%",
            overflow: "ease",
          }}
        >
          {alertProps.message}
        </Alert>
      </Slide>
      <Box id="admin-equipment-select-wrapper">
        {/* NAME */}
        <FormControl variant="standard" className="show-user-dialog-input">
          <InputLabel htmlFor="user-name">{t("Full Name")}</InputLabel>
          <Input id="user-name" value={selectedUser?.name} />
        </FormControl>
        <FormControl variant="standard" className="show-user-dialog-input">
          <InputLabel htmlFor="user-email">{t("Email")}</InputLabel>
          <Input id="user-email" value={selectedUser?.email} />
        </FormControl>
        <FormControl variant="standard" className="show-user-dialog-input">
          <InputLabel htmlFor="user-role">{t("Role")}</InputLabel>
          <Select
            labelId="user-role"
            id="user-role-select"
            value={selectedUser?.role}
            onChange={(e) => handleChangeUserRole(e)}
          >
            {userRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <UserStaticCheckBoxes
          user={user ? user : null}
          onChange={handleCheckboxClick}
          selectedUser={selectedUser}
        />
        <Typography sx={{ marginTop: "20px", fontWeight: "bold" }}>
          {t("User Access Rights")}
        </Typography>
        <Divider />
        <FormGroup sx={{ margin: "0 0 100px 0" }}>
          {equipmentTypes.map((type) => (
            <React.Fragment key={type}>
              <FormControlLabel
                sx={{ margin: "20px 0 0 0" }}
                control={
                  <Checkbox color="primary" id={`equipment-type-${type}`} />
                }
                checked={selectedUser.access?.split(",").includes(type)}
                label={type}
                name="type"
                onChange={(e) => handleCheckboxClick(e)}
              />
              <Divider />
              {getEquipmentNames(type).map((name) => (
                <FormControlLabel
                  style={{ marginLeft: "20px" }}
                  key={name}
                  control={
                    <Checkbox color="primary" id={`equipment-name-${name}`} />
                  }
                  checked={selectedUser.access?.split(",").includes(name)}
                  label={name}
                  name="name"
                  onChange={(e) => handleCheckboxClick(e)}
                />
              ))}
            </React.Fragment>
          ))}
        </FormGroup>
        <FmButtonDanger onClick={handleDeleteUserClick}>
          {t("Delete User")}
        </FmButtonDanger>
      </Box>
    </Dialog>
  );
};

export default UsersDialog;
