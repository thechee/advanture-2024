import { useContext } from "react";
import { FormContext } from "../context/FormContext";

export const useVanFormContext = () => useContext(FormContext);