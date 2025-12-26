import {
  Box,
  Divider,
  SelectChangeEvent,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./equipment.css";
import { FmButton2 } from "../../../utils/buttons";
import { useEffect, useState } from "react";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import i18next from "i18next";
import { NewEquipment } from "../../../interfaces";
import {
  addNewEquipment,
  getEquipment,
  removeEquipment,
} from "../../../service/equipment.service";
import { useEquipment } from "../../../EquipmentContext";
import { useUser } from "../../../UserContext";
import EquipmentTable from "./equipmentTable";
import { useAlert } from "../../../AlertContext";
import AddEquipmentDialog from "./equipmentDialogs";

const AdminEquipmentComponent = () => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const { equipment, findEquipmentId, equipmentTypes, getEquipmentNames } =
    useEquipment();

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 600);
  });

  const [addEquipmentDialogOpen, setAddEquipmentDialogOpen] =
    useState<boolean>(false);

  const handleAddEquipmentDialogOpen = () => setAddEquipmentDialogOpen(true);
  const handleAddEquipmentDialogClose = () => setAddEquipmentDialogOpen(false);
  const handleAddClick = () => handleAddEquipmentDialogOpen();

  const handleRemoveEquipmentClick = async (id?: string) => {
    if (!id) {
      showAlert({ severity: "error", message: t("Equipment ID not found") });
      return;
    }
    const res = await removeEquipment(id);
    alert(res);
    window.location.reload();
    return;
  };

  return (
    <>
      <Box id="my-page-header">{t("Equipment Management")}</Box>
      {/* <Divider /> */}
      <Box id="my-page-wrapper">
        <EquipmentTable
          isMobile={isMobile}
          getEquipment={getEquipment}
          equipment={Array.isArray(equipment) ? equipment : []}
          handleRemoveEquipmentClick={handleRemoveEquipmentClick}
        />
      </Box>

      <Box id="admin-equipment-wrapper">
        {/* <FmButton2 className="admin-equipment-button" onClick={handleEditClick}>
          {t("Edit")}
        </FmButton2> */}
        <FmButton2 className="admin-equipment-button" onClick={handleAddClick}>
          {t("New Equipment")}
        </FmButton2>
      </Box>
      <AddEquipmentDialog
        equipmentTypes={equipmentTypes}
        addEquipmentDialogOpen={addEquipmentDialogOpen}
        handleAddEquipmentDialogClose={handleAddEquipmentDialogClose}
        getEquipmentNames={getEquipmentNames}
      />
    </>
  );
};

export default AdminEquipmentComponent;
