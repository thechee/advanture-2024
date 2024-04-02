import { createContext, useState } from "react";

export const FormContext = createContext({});

export const FormProvider = ({ children }) => {

  const title = {
    0: "Van Information",
    1: "Location",
    2: "Description",
    3: "Images",
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
    image: null,
    fileName: "",
    imageURL: "",
  });

  // const [year, setYear] = useState("placeholder");
  // const [make, setMake] = useState("placeholder");
  // const [model, setModel] = useState("");
  // const [miles, setMiles] = useState("");
  // const [address, setAddress] = useState("");
  // const [city, setCity] = useState("");
  // const [state, setState] = useState("placeholder");
  // const [zipCode, setZipCode] = useState("");
  // const [rentalRate, setRentalRate] = useState("");
  // const [description, setDescription] = useState("");
  // const [distanceIncluded, setDistanceIncluded] = useState("");
  // const [unlimited, setUnlimited] = useState(false);
  // const [mpg, setMpg] = useState("");
  // const [doors, setDoors] = useState("placeholder");
  // const [seats, setSeats] = useState("placeholder");
  // const [fuelTypeId, setFuelTypeId] = useState("placeholder");
  // const [image, setImage] = useState(null);
  // const [fileName, setFileName] = useState("");
  // const [imageURL, setImageURL] = useState("");

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const maxFileError = "Image exceeds the maximum file size of 5Mb";

  const automotiveYear = new Date().getFullYear() + 1;
  const yearsOptions = [];
  for (let i = automotiveYear; i >= 1950; i--) {
    yearsOptions.push(i);
  }
  const doorsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const seatsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const makes = ["Ford", "Dodge", "Ram", "Volkswagen", "Mercedes", "Toyota"];
  const zipCodeRegex = /\d{5}/;

  const handleChange = (e) => {
    const { type, name } = e.target;
    const value = type === "checkbox" ? e.target.checked : e.target.value;

    setData({ ...data, [name]: value });
  }

  return (
    <FormContext.Provider 
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
        maxFileError,
        yearsOptions,
        doorsOptions,
        seatsOptions,
        makes,
        zipCodeRegex,
        handleChange
      }}
    >
      {children}
    </FormContext.Provider>
  );
}