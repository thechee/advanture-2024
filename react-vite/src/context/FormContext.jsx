import { createContext, useState, useEffect } from "react";

export const FormContext = createContext({});

export const FormProvider = ({ children }) => {
  const [page, setPage] = useState(0);
  

  return (
    <FormContext.Provider value={{ form, setForm }}>
      {children}
    </FormContext.Provider>
  );
}