import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import BuyCredit from "./pages/BuyCredit"
import GenerateImage from "./pages/GenerateImage"
import { Route, Routes } from "react-router-dom"
import Footer from "./components/Footer"
import Login from "./components/Login"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"
import { ToastContainer } from 'react-toastify';

export default function App() {

    const { showLogin } = useContext(AppContext);

    return (
        <>
            <div className="px-4 sm:px-10 md:x-14 lg:px-28 min-h-screen">
            <ToastContainer position="top-center" />
                <Navbar />
                {showLogin && <Login />}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/buy-credits" element={<BuyCredit />} />
                    <Route path="/generate-image" element={<GenerateImage />} />
                </Routes>
                <Footer />
            </div>
        </>
    )
}