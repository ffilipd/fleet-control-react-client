import {
  Alert,
  AppBar,
  Box,
  Dialog,
  IconButton,
  SelectChangeEvent,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import "./equipment.css";
import { FmButton2 } from "../../../utils/buttons";
import { useEffect, useState } from "react";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { NewEquipment } from "../../../interfaces";
import { addNewEquipment } from "../../../service/equipment.service";
import { useUser } from "../../../UserContext";
import { useAlert } from "../../../AlertContext";
import NewEquipmentForm from "./NewEquipmentForm";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AddEquipmentDialogProps {
  equipmentTypes: string[];
  addEquipmentDialogOpen: boolean;
  handleAddEquipmentDialogClose: () => void;
  getEquipmentNames: (type: string) => string[];
}

const AddEquipmentDialog = (props: AddEquipmentDialogProps) => {
  const {
    equipmentTypes,
    addEquipmentDialogOpen,
    handleAddEquipmentDialogClose,
    getEquipmentNames,
  } = props;
  const { t } = useTranslation();
  const { user } = useUser();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { showAlert, alertProps, alertVisible } = useAlert();

  const [newType, setNewType] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newEquipment, setNewEquipment] = useState<NewEquipment>({
    type: "",
    name: "",
    identifier: "",
    userId: user?.id,
  });
  const [newTypeInputVisible, setNewTypeInputVisible] =
    useState<boolean>(false);
  const [newNameInputVisible, setNewNameInputVisible] =
    useState<boolean>(false);
  const [availableEquipmentNames, setAvailableEquipmentNames] = useState<
    string[]
  >([""]);

  useEffect(() => {
    if (newEquipment.type)
      setAvailableEquipmentNames(getEquipmentNames(newEquipment.type));
  }, [newEquipment, getEquipmentNames]);

  const handleSetNewType = (newType: string) => {
    setNewType(newType);
  };

  const handleSetNewName = (newName: string) => {
    setNewName(newName);
  };

  const handleSetType = (event: SelectChangeEvent) => {
    const typeName = event.target.value;

    if (typeName === "new-type") {
      setNewTypeInputVisible(true);
      setNewNameInputVisible(true);
      setNewEquipment({ ...newEquipment, name: "new-name", type: typeName });
      return;
    } else {
      setNewTypeInputVisible(false);
      setNewNameInputVisible(false);
    }

    setNewEquipment({ ...newEquipment, type: typeName });
  };

  const handleAddEquipmentClick = async () => {
    let equipmentToSave = { ...newEquipment };
    if (newEquipment.type === "new-type") {
      equipmentToSave.type = newType;
    }
    if (newEquipment.name === "new-name") {
      equipmentToSave.name = newName;
    }
    try {
      const res = await addNewEquipment(equipmentToSave);
      showAlert({ severity: "success", message: res });
      setNewEquipment({
        ...newEquipment,
        type: "",
        name: "",
        identifier: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetName = (event: SelectChangeEvent) => {
    const newName = event.target.value;
    if (newName === "new-name") {
      setNewNameInputVisible(true);
    }
    setNewEquipment({ ...newEquipment, name: newName });
  };

  const handleSetNumber = (
    event:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const number = event.target.value;
    const eventName = event.target.name;
    if (eventName === "newNumber")
      setNewEquipment({ ...newEquipment, identifier: number });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      open={addEquipmentDialogOpen}
      onClose={handleAddEquipmentDialogClose}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "var(--color-theme-dark)",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleAddEquipmentDialogClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t("Add new equipment")}
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
        <Box id="admin-equipment-select-box">
          <NewEquipmentForm
            equipmentTypes={equipmentTypes}
            newEquipment={newEquipment}
            newTypeInputVisible={newTypeInputVisible}
            newNameInputVisible={newNameInputVisible}
            availableEquipmentNames={availableEquipmentNames}
            handleSetType={handleSetType}
            handleSetNewType={handleSetNewType}
            handleSetName={handleSetName}
            handleSetNewName={handleSetNewName}
            handleSetNumber={handleSetNumber}
          />
          <FmButton2
            disabled={newEquipment.identifier === ""}
            onClick={handleAddEquipmentClick}
          >
            {t("Add Equipment")}
          </FmButton2>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddEquipmentDialog;
