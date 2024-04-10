import { createContext, useState } from "react";

export const VanListContext = createContext();

export const VanListProvider = (props) => {
  const [make, setMake] = useState("placeholder")
  const [years, setYears] = useState([1950, new Date().getFullYear() + 1])
  const [seats, setSeats] = useState("placeholder")
  const [fuelTypes, setFuelTypes] = useState([])
  const [mileage, setMileage] = useState(100)
  const [sort, setSort] = useState("")
  const [price, setPrice] = useState([10, 250])

  const handleReset = () => {
    setMake("placeholder")
    setYears([1950, new Date().getFullYear() + 1])
    setSeats("placeholder")
    setFuelTypes([])
    setMileage(100)
  }

  const allYears = JSON.stringify(years) === JSON.stringify([1950, new Date().getFullYear() + 1])
  const allPrices = JSON.stringify(price) === JSON.stringify([10, 250])

  let count = 0;
  if (make !== "placeholder") count++;
  if (!allYears) count++;
  if (seats !== "placeholder") count++;
  if (fuelTypes.length) count++;
  if (mileage !== 100) count++;

  return (
    <VanListContext.Provider 
      value={{ 
        price, 
        setPrice, 
        allPrices, 
        sort, 
        setSort, 
        make, 
        setMake, 
        years, 
        setYears, 
        seats, 
        setSeats, 
        fuelTypes, 
        setFuelTypes, 
        mileage, 
        setMileage, 
        handleReset, 
        count, 
        allYears 
      }} 
    >
      {props.children}
    </VanListContext.Provider>
  )
}