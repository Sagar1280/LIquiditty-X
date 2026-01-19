import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal.jsx";
import { Outlet } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { startMarketSocket } from "../data/marketSocket.js";
import { useWalletStore } from "../store/walletStore.js";
import { useMarketStore } from "../store/marketStore.js";



const Rootlayout = () => {

  const authModal = useAuthStore((s) => s.authModal);
  const restoreSession = useAuthStore((s)=> s.restoreSession);
  const fetchWallet = useWalletStore((s) => s.fetchWallet)
  const accessToken = useAuthStore((s)=> s.accessToken);
  const marketMode = useMarketStore((s) => s.marketMode);

   // 1️⃣ Restore auth session ONCE
  useEffect(() => {
    restoreSession();
  }, []);

  // 2️⃣ Start / restart market socket when mode changes
  useEffect(() => {
    startMarketSocket(marketMode);
  }, [marketMode]);

  // 3️⃣ Fetch wallet after access token exists
  useEffect(() => {
    if (accessToken) {
      fetchWallet();
    }
  }, [accessToken, fetchWallet]);

   /// using two useEffect because of race contions ,, first acces token is generated and
   //  then wallet is fetched

  return (
    <>
      <Navbar />
      <Outlet />
      {authModal && <AuthModal />}
    </>
  )
}

export default Rootlayout