import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { NewEquipment } from "../../../interfaces";
import "./equipment.css";
import i18next from "i18next";

interface EquipmentFormProps {
  equipmentTypes: string[];
  newEquipment: NewEquipment;
  newTypeInputVisible: boolean;
  newNameInputVisible: boolean;
  availableEquipmentNames: string[];
  handleSetType: (event: SelectChangeEvent) => void;
  handleSetNewType: (newType: string) => void;
  handleSetName: (event: SelectChangeEvent) => void;
  handleSetNewName: (newName: string) => void;
  handleSetNumber: (
    event:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const NewEquipmentForm: React.FC<EquipmentFormProps> = ({
  equipmentTypes,
  newEquipment,
  newTypeInputVisible,
  newNameInputVisible,
  availableEquipmentNames,
  handleSetType,
  handleSetNewType,
  handleSetName,
  handleSetNewName,
  handleSetNumber,
}) => {
  const { t } = useTranslation();

  const labels = {
    equipment: {
      type: "*" + i18next.t("Equipment type"),
      name: "*" + i18next.t("Name"),
      number: "*" + i18next.t("Number"),
      newType: "*" + i18next.t("Enter new type"),
      newName: "*" + i18next.t("Enter new name"),
    },
  };

  return (
    <Box>
      {/* TYPE */}
      <FormControl fullWidth className="admin-equipment-select-item">
        <InputLabel id="equipment-type">{labels.equipment.type}</InputLabel>
        <Select
          className="booking-select-button"
          labelId="equipment-type-label"
          id="equipment-type"
          label={labels.equipment.type}
          value={newEquipment.type || ""}
          name="newType"
          onChange={handleSetType}
        >
          <MenuItem key={"new-type"} value={"new-type"}>
            {`–– ${t("New")} ––`}
          </MenuItem>
          {equipmentTypes.map((type: string, index: number) => (
            <MenuItem key={`${type}-${index}`} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {newTypeInputVisible && (
        <FormControl fullWidth className="admin-equipment-select-item">
          <TextField
            className="new-item-textfield"
            id="new-type-input"
            label={labels.equipment.newType}
            autoFocus
            onChange={(e) => handleSetNewType(e.target.value)}
          />
          <Divider sx={{ margin: "16px 0 0 0" }} />
        </FormControl>
      )}

      {/* CLASS/NAME */}
      <FormControl fullWidth className="admin-equipment-select-item">
        <InputLabel id="equipment-name">{labels.equipment.name}</InputLabel>
        <Select
          labelId="equipment-name-label"
          disabled={newEquipment.type === ""}
          id="equipment-name"
          label={labels.equipment.name}
          value={
            newEquipment.type === "new-type" ? "new-name" : newEquipment.name
          }
          name="newName"
          onChange={handleSetName}
        >
          <MenuItem key={"new-name"} value={"new-name"}>
            {`–– ${t("New")} ––`}
          </MenuItem>
          {availableEquipmentNames.map((name: string, index: number) => (
            <MenuItem key={`${name}-${index}`} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {newNameInputVisible && (
        <FormControl fullWidth className="admin-equipment-select-item">
          <TextField
            id="new-name-input"
            className="new-item-textfield"
            label={labels.equipment.newName}
            autoFocus
            onChange={(e) => handleSetNewName(e.target.value)}
          />
          <Divider sx={{ margin: "16px 0 0 0" }} />
        </FormControl>
      )}

      {/* NUMBER */}
      <FormControl fullWidth className="admin-equipment-select-item">
        <TextField
          id="number-input"
          className="booking-select-button"
          label={labels.equipment.number}
          autoFocus
          disabled={newEquipment.name === ""}
          name="newNumber"
          onChange={handleSetNumber}
        />
        <Divider sx={{ margin: "16px 0 0 0" }} />
      </FormControl>
    </Box>
  );
};

export default NewEquipmentForm;
