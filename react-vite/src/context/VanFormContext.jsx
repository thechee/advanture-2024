import { createContext, useState } from "react";

export const VanFormContext = createContext();

export const VanFormProvider = ({ children }) => {

  const title = {
    0: "Van Information",
    1: "Location",
    2: "Description",
    3: "Photos",
  }

  const [page, setPage] = useState(0);

  const [data, setData] = useState({
    year: "placeholder",
    make: "placeholder",
    model: "",
    miles: "",
    address: "",
    city: "",
    state: "placeholder",
    zipCode: "",
    rentalRate: "",
    description: "",
    distanceIncluded: "",
    unlimited: false,
    mpg: "",
    doors: "placeholder",
    seats: "placeholder",
    fuelTypeId: "placeholder",
    images: [],
  });


  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const automotiveYear = new Date().getFullYear() + 1;
  const yearsOptions = [];
  for (let i = automotiveYear; i >= 1950; i--) {
    yearsOptions.push(i);
  }
  const doorsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const seatsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const makesOptions = ["Ford", "Dodge", "Ram", "Volkswagen", "Mercedes", "Toyota"];
  const zipCodeRegex = /\d{5}/;

  const handleChange = (e) => {
    const { type, name } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;

    setData({ ...data, [name]: value });
    setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  }


  return (
    <VanFormContext.Provider 
      value={{
        title,
        page,
        setPage,
        data,
        setData,
        validationErrors,
        setValidationErrors,
        loading,
        setLoading,
        yearsOptions,
        doorsOptions,
        seatsOptions,
        makesOptions,
        zipCodeRegex,
        handleChange,
      }}
    >
      {children}
    </VanFormContext.Provider>
  );
}