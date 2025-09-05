/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getCurrentUser } from "@/components/auth/services";
import React, { createContext, useContext, useEffect, useState } from "react";
interface IUserContext {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    setIsLoading(false);
  };
  useEffect(() => {
    handleUser();
  }, [isLoading]);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsLoading,
        isLoading,
        refetchUser: handleUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context == undefined) {
    throw new Error("useUser must be used within the UserProvider context");
  }

  return context;
};

export default UserProvider;
