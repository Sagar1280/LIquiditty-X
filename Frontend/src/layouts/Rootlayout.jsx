import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal.jsx";
import { Outlet } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";



const Rootlayout = () => {

  const authModal = useAuthStore((s) => s.authModal);
  const restoreSession = useAuthStore((s)=> s.restoreSession);

  useEffect(() => {
    restoreSession();
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