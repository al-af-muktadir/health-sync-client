// "use client";

// import { getCurrentUser } from "@/components/auth/services";
// import React, { createContext, useContext, useEffect, useState } from "react";
// interface IUserProvider{

//     user:React.Dispatch<React.SetStateAction<null>>
// }
// export const UserContext = createContext(undefined);

// const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState(null);

//   const [isLoading, setIsLoading] = useState(true);

//   const handleUser = async () => {
//     const user = await getCurrentUser();
//     setUser(user);
//     setIsLoading(false);
//   };
//   useEffect(() => {
//     handleUser();
//   }, [isLoading]);
//   return (
//     <UserContext.Provider
//       value={{ user, setUser, isLoading, refetchUser: handleUser }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context == undefined) {
//     throw new Error("useUser must be used within the UserProvider context");
//   }

//   return context;
// };

// export default UserProvider;
