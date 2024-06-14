import { Link, useRouteError } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import {Footer} from '../Footer/Footer';
import './Errors.css'


export const Errors = () => {
  let error = useRouteError()

  return (
    <>
    <Navigation />
    <div className='error-page'>
      <h1 className="four-oh-four error" style={{fontSize: '72px', marginBottom: "1rem"}}>{error.status}</h1>
      <h2 className="four-oh-four error">{error.statusText}</h2>
      <h2 className="four-oh-four error">{error.data}</h2>
      <Link style={{color:" var(--purple)"}} to={"/vans"}>Back to vans</Link>
    </div>
    <Footer />
    </>
  )
}