import { useVanFormContext } from '../../../hooks/useVanFormContext';
import { VanInfo } from './VanInfo';
import { VanLocation } from './VanLocation';
import { VanDescription } from './VanDescription';
import { VanImages } from './VanImages';

export const FormInputs = ({ type }) => {
  const { page } = useVanFormContext();

  const display = {
    0: <VanInfo />,
    1: <VanLocation type={type}/>,
    2: <VanDescription />,
    3: <VanImages type={type}/>
  }
  
  return (  
    <>
      {display[page]}
    </>
  )
}