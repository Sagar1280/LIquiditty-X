import { createBrowserRouter } from "react-router-dom";
import Rootlayout from "./layouts/Rootlayout";

import Home from './pages/Home'
import TradeSpot from './pages/spot/TradeSpot'
import FuturesTrading from './pages/futures/FuturesTrading'
import ConvertCrypto from './pages/buy/ConvertCrypto'
import DepositUsdt from "./pages/buy/DepositUsdt";




const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Rootlayout />,
            children: [
                { index: true, element: <Home /> },
                { path: 'spot', element: <TradeSpot /> },
                { path: 'futures', element: <FuturesTrading /> },
                {
                    path: 'buy',
                    children: [
                        { index: true, element: <ConvertCrypto /> },
                        { path: 'convert', element: <ConvertCrypto /> },
                        { path: 'depositUsdt', element: <DepositUsdt /> },
                    ],
                },
            ],


        },
    ],
)

export default router