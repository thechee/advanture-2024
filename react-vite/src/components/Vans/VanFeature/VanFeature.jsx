import { AutomaticTrans, Aux, BikeRack, Bluetooth, MiscFeature, USBCharger } from "../../Icons";


export const VanFeature = ({ feature }) => {
  const featureIcon = () => {
    switch (feature) {
      case "Automatic transmission":
        return <AutomaticTrans />;
      case "Aux input":
        return <Aux />;
      case "Bike rack":
        return <BikeRack />;
      case "Bluetooth":
        return <Bluetooth />;
      case "USB charger":
        return <USBCharger />;
      default:
        return <MiscFeature />;
    }
  }
  
  return (
    <li>
      {featureIcon()}
      {feature}
    </li>
  )
};