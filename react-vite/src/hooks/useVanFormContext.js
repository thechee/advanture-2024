import { useContext } from "react";
import { VanFormContext } from "../context/VanFormContext";

export const useVanFormContext = () => useContext(VanFormContext);