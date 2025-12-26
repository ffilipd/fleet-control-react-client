import { Box, Typography } from "@mui/material";
import { FmButton, FmButton2, FmButtonSecondary } from "../../utils/buttons";
import { useState } from "react";
import { useEquipment } from "../../EquipmentContext";

const MobileBooking = () => {
  const { equipment, equipmentTypes, getEquipmentNames } = useEquipment();

  const [selectedEquipment, setSelectedEquipment] = useState<{
    type: string;
    equipmentNameId: string;
    number: string;
  }>({ type: "", equipmentNameId: "", number: "" });

  const [selectedEquipmentString, setSelectedEquipmentString] =
    useState<string>("");
  const [availableEquipmentNames, setAvailableEquipmentNames] = useState<any>(
    []
  );

  const [expanded, setExpanded] = useState(-1);

  const handleExpand = (index: number) => {
    setExpanded(index === expanded ? -1 : index);
  };

  const handleMobileSelectEquipmentName = (name: string, index: number) => {
    setSelectedEquipmentString(name);
    handleExpand(index);
  };
  const handleMobileSelectEquipmentType = (type: string, index: number) => {
    setSelectedEquipment({ ...selectedEquipment, type });
    setSelectedEquipmentString(type);
    setAvailableEquipmentNames(getEquipmentNames(type));
    handleExpand(index);
  };

  const handleMobileSelectEquipmentNumber = (number: number, index: number) => {
    setSelectedEquipmentString(selectedEquipmentString + " #" + number);
    handleExpand(index);
  };

  if (equipment) console.log(equipment);

  return (
    <Box>
      {equipmentTypes.map((item: string, index: number) => (
        <Box key={`${item}-${index}`}>
          <FmButton2
            sx={{
              width: "100%",
              marginBottom: "15px",
              display: "flex",
              backgroundColor: expanded === index ? "#053654" : "",
            }}
            onClick={() => handleMobileSelectEquipmentType(item, index)}
          >
            {item}
          </FmButton2>
          {expanded === index && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {availableEquipmentNames.map((item: string, index: number) => (
                <FmButton2
                  key={`${item}-${index}`}
                  sx={{
                    width: "80%",
                    height: "30px",
                    marginBottom: "15px",
                    display: "flex",
                    backgroundColor: expanded === index ? "#053654" : "",
                  }}
                  onClick={() => handleMobileSelectEquipmentName(item, index)}
                >
                  {item}
                </FmButton2>
              ))}
            </Box>
          )}
        </Box>
      ))}
      <Typography
        sx={{
          padding: "4px 15px",
          borderRadius: "50px",
        }}
      >
        Selected: {selectedEquipmentString}
      </Typography>
    </Box>
  );
};

export default MobileBooking;
