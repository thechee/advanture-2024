import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { getKey } from "../redux/maps";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const key = useSelector((state) => state.maps.key);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  if (!key) {
    return null;
  }


  return (
    <>
      <ModalProvider>
        <APIProvider apiKey={key}>

        <Navigation />
        {isLoaded && <Outlet />}
        </APIProvider>
        <Modal />
      </ModalProvider>
    </>
  );
}
