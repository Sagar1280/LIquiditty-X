import Navbar from "../components/Navbar";  
import AuthModal from "../components/AuthModal.jsx";
import {Outlet} from 'react-router-dom';
import { useAuthStore } from "../store/authStore";


const Rootlayout = () => {

  const authModal = useAuthStore((s) => s.authModal);

  return (
    <>
    <Navbar />
    <Outlet />
    {authModal && <AuthModal />}
    </>
  )
}

export default Rootlayout