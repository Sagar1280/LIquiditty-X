import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal.jsx";
import { Outlet } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { startMarketSocket } from "../data/marketSocket.js";



const Rootlayout = () => {

  const authModal = useAuthStore((s) => s.authModal);
  const restoreSession = useAuthStore((s)=> s.restoreSession);

  useEffect(() => {
    restoreSession();

    startMarketSocket();
  }, []);


  return (
    <>
      <Navbar />
      <Outlet />
      {authModal && <AuthModal />}
    </>
  )
}

export default Rootlayout