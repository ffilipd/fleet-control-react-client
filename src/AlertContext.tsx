// filepath: /home/filip/tmp/swc-react/client/src/context/AlertContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { AlertProps } from "@mui/material";

interface AlertContextProps {
  alertVisible: boolean;
  alertProps: AlertProps & { message: string };
  showAlert: (props: AlertProps & { message: string }) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState<
    AlertProps & { message: string }
  >({
    severity: "info",
    message: "",
  });

  const showAlert = (props: AlertProps & { message: string }) => {
    setAlertProps(props);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  return (
    <AlertContext.Provider
      value={{ alertVisible, alertProps, showAlert, hideAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
