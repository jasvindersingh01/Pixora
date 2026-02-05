import { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export default function AppContextProvider(props) {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/user/credits", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Failed to load credits"
            );
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken("")
        setUser(null);
    }

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/image/generate-image", { prompt }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                loadCreditsData();
                return data.image
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) {
                    navigate("/buy-credits")
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Failed to generate image"
            );
        }
    }

    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
    }, [token])

    const value = {
        user, setUser, showLogin, setShowLogin, token, setToken, credit, setCredit, backendUrl, loadCreditsData, logout, generateImage
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}