import { Link, useRouteError } from 'react-router-dom';
import Layout from '../../router/Layout';
import './Errors.css'


export const Errors = () => {
  let error = useRouteError()

  return (
    <>
    <Layout />
    <div className='error-page'>
      <h1 className="four-oh-four error">{error.status}</h1>
      <h2 className="four-oh-four error">{error.statusText}</h2>
      <h2 className="four-oh-four error">{error.data}</h2>
      <Link style={{color:" var(--purple)"}} to={"/vans"}>Back to vans</Link>
    </div>
    </>
  )
}