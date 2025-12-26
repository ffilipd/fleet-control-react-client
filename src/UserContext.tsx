import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FMProfile, LoginCredentials } from "./interfaces";
import {
  createUser,
  loginWithCredentials,
  loginWithGoogle,
} from "./service/user.service";
import {
  CredentialResponse,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import i18next from "i18next";

type UserContextType = {
  setUser: React.Dispatch<React.SetStateAction<FMProfile | null>>;
  logOut: () => void;
  googleLogin: () => void;
  credentialLogin: (credentials: LoginCredentials) => void;
  user: FMProfile | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FMProfile | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "undefined" // google auth started returning "undefined" if user is not activated
      ? JSON.parse(storedUser)
      : null;
  });
  const logOut = () => {
    googleLogout();
    // localStorage.removeItem("user");
    localStorage.clear();
    setUser(null);
  };

  const credentialLogin = async (credentials: any) => {
    try {
      const user = await loginWithCredentials(credentials);
      if (!user) return;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      alert("Error logging in: " + error.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }: any) => {
      const user = await loginWithGoogle(access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    },
    onError: (error) => console.log("Login Failed: " + error),
  });

  useEffect(() => {
    i18next.changeLanguage(user?.language);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        setUser,
        logOut,
        googleLogin,
        credentialLogin,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
