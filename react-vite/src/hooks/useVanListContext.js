import { useContext } from "react";
import { VanListContext } from "../context/VanListContext";

export const useVanListContext = () => useContext(VanListContext);