import { createContext, useContext, useState } from "react";

export const VanListContext = createContext();
export const useVanListContext = () => useContext(VanListContext);  

export const VanListProvider = (props) => {
  const [make, setMake] = useState("placeholder")
  const [years, setYears] = useState([1950, new Date().getFullYear() + 1])
  const [seats, setSeats] = useState("placeholder")
  const [fuelTypes, setFuelTypes] = useState([])
  const [mileage, setMilage] = useState(100)
  const [sort, setSort] = useState("")
  const [price, setPrice] = useState([10, 250])

  const handleReset = () => {
    setMake("placeholder")
    setYears([1950, new Date().getFullYear() + 1])
    setSeats("placeholder")
    setFuelTypes([])
    setMilage(100)
  }

  const allYears = JSON.stringify(years) === JSON.stringify([1950, new Date().getFullYear() + 1])

  let count = 0;
  if (make !== "placeholder") count++;
  if (!allYears) count++;
  if (seats !== "placeholder") count++;
  if (fuelTypes.length) count++;
  if (mileage !== 100) count++;

  return (
    <VanListContext.Provider value={{ price, setPrice, sort, setSort, make, setMake, years, setYears, seats, setSeats, fuelTypes, setFuelTypes, mileage, setMilage, handleReset, count, allYears }} >
      {props.children}
    </VanListContext.Provider>
  )
}