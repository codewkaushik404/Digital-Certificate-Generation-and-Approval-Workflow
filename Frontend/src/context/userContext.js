import { createContext, useContext } from "react";

export const UserContext = createContext();

export function useUserContext(){
    const context = useContext(UserContext);
    if(!context) throw new Error("context must be used within its Provider"); 
    return context;
}
