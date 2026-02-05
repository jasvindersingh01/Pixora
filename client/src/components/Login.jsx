import { useContext, useEffect, useState } from "react";
import { assets } from "../assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {

    const [state, setState] = useState("Login");
    const { setShowLogin, backendUrl, setToken, setUser, loadCreditsData } = useContext(AppContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === "Login") {
                const { data } = await axios.post(
                    backendUrl + "/api/user/login",
                    { email, password }
                );

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);

                    await loadCreditsData(data.token);

                    setShowLogin(false);
                } else {
                    toast.error(data.message);
                }

            } else {
                const { data } = await axios.post(
                    backendUrl + "/api/user/register",
                    { name, email, password }
                );

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem("token", data.token);

                    await loadCreditsData(data.token);
                    
                    setShowLogin(false);
                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };


    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center"
        >
            <motion.form
                onSubmit={onSubmitHandler}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative bg-white p-10 rounded-xl text-slate-500"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="text-center text-2xl text-neutral-500 font-medium"
                >
                    {state}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="text-sm text-center pt-1"
                >
                    Welcome back! Please sign in to continue
                </motion.p>

                {state !== "Login" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5"
                    >
                        <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" stroke="#6B7280" strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input onChange={e => setName(e.target.value)} value={name} type="text" className="outline-none text-sm" placeholder="Full Name" required />
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4"
                >
                    <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375" stroke="#6B7280" strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z" stroke="#6B7280" strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <input onChange={e => setEmail(e.target.value)} value={email} type="email" className="outline-none text-sm" placeholder="Email Address" required />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4"
                >
                    <svg width="16" height="16" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
                    </svg>
                    <input onChange={e => setPassword(e.target.value)} value={password} type="password" className="outline-none text-sm" placeholder="Password" required />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    className="text-sm text-purple-600 my-4 cursor-pointer"
                >
                    Forgot password?
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full text-white py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 transition cursor-pointer"
                >
                    {state === "Login" ? "Login" : "Create Account"}
                </motion.button>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="mt-5 text-center"
                >
                    {state === "Login" ? (
                        <>
                            Don't have an account?{" "}
                            <span className="text-purple-600 cursor-pointer" onClick={() => setState("Sign Up")}>
                                Sign Up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span className="text-purple-600 cursor-pointer" onClick={() => setState("Login")}>
                                Login
                            </span>
                        </>
                    )}
                </motion.p>

                <motion.img
                    onClick={() => setShowLogin(false)}
                    src={assets.close}
                    alt=""
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                    className="absolute top-5 right-5 cursor-pointer w-3"
                />
            </motion.form>
        </motion.div>

    )
}