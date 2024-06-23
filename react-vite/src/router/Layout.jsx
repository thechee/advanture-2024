import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { APIProvider } from "@vis.gl/react-google-maps";
import ReactGA from 'react-ga';
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import { getKey } from "../redux/maps";
import { VanListProvider } from "../context/VanListContext";
import { Footer } from "../components/Footer/Footer";

const TRACKING_ID = "G-PLRG23QSQK";
ReactGA.initialize(TRACKING_ID, {
  siteSpeedSampleRate: 100
});


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
    <VanListProvider>
      <ModalProvider>
        <APIProvider apiKey={key}>
          <div className="content">
          <Navigation />
            {isLoaded && <Outlet />}
          </div>
          <Footer />
        </APIProvider>
        <Modal />
      </ModalProvider>
      </VanListProvider>
    </>
  );
}
