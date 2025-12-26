import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getEquipmentTree, getEquipmentId } from "./service/equipment.service";
import {
  Equipment,
  EquipmentFilterResponse,
  EquipmentIdSearchParams,
  EquipmentSearchParams,
  EquipmentTree,
} from "./interfaces";
import { useUser } from "./UserContext";

type EquipmentContextType = {
  equipment: EquipmentTree | null;
  equipmentTypes: string[];
  equipmentNames: string[];
  getEquipmentNames: (equipmentType: string) => string[];
  getEquipmentNumbers: (equipmentName: string) => string[];
  findEquipmentId: (
    equipment: EquipmentIdSearchParams
  ) => Promise<string | undefined>;
  populateEquipment: () => void;
};

const EquipmentContext = createContext<EquipmentContextType | undefined>(
  undefined
);

type EquipmentProviderProps = {
  children: ReactNode;
};

const EquipmentProvider: React.FC<EquipmentProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [equipment, setEquipment] = useState<EquipmentTree | null>(() => {
    const storedEquipment = localStorage.getItem("equipment");
    return storedEquipment ? JSON.parse(storedEquipment) : null;
  });

  const [equipmentNames, setEquipmentNames] = useState<string[]>(() => {
    if (equipment && !Array.isArray(equipment)) return [];
    return equipment
      ? equipment.flatMap((equipmentObj: any) =>
          equipmentObj.names.map((name: any) => name.name as string)
        )
      : [];
  });

  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);

  const getEquipmentNames = (equipmentType: string): string[] => {
    if (!equipment) return [];
    const type = equipment.find(
      (typeObj: any) => typeObj.typeName === equipmentType
    ) as Equipment;
    return type ? type.names.map((nameObj: any) => nameObj.name) : [];
  };

  const getEquipmentNumbers = (equipmentName: string): string[] => {
    if (!equipment) return [];
    for (const type of Object.values(equipment)) {
      for (const name of type.names) {
        if (name.name === equipmentName) {
          return name.identifiers;
        }
      }
    }
    return [];
  };

  const findEquipmentId = async (
    equipment: EquipmentIdSearchParams
  ): Promise<string | undefined> => {
    const equipmentId = await getEquipmentId(equipment);
    if (equipmentId) {
      return equipmentId;
    }
    return undefined;
  };

  const populateEquipment = async () => {
    if (user) {
      const equipment = await getEquipmentTree(user.id);
      if (equipment && !Array.isArray(equipment)) return [];
      localStorage.setItem("equipment", JSON.stringify(equipment));
      setEquipment(equipment);

      const types: any = equipment.map((typeObj: any) => typeObj.typeName);
      setEquipmentTypes(types);

      const names: any = equipment.flatMap((equipmentObj: any) =>
        equipmentObj.names.map((name: any) => name.name as string)
      );
      setEquipmentNames(names);
    }
  };

  useEffect(() => {
    populateEquipment();
  }, [user]);

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        equipmentTypes,
        equipmentNames,
        getEquipmentNames,
        getEquipmentNumbers,
        findEquipmentId,
        populateEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

const useEquipment = (): EquipmentContextType => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useEquipment must be used within a UserProvider");
  }
  return context;
};

export { EquipmentProvider, useEquipment };
