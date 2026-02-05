import { use, useContext } from "react"
import { assets, pricingPlans } from "../assets/index"
import { AppContext } from "../context/AppContext"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function BuyCredit() {

  const { user, backendUrl, loadCreditsData, token, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const initPay = async (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Pixora",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + "/api/user/verify-razorpay", response, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          if (data.success) {
            loadCreditsData();
            navigate("/");
            toast.success("Credits added successfully!")
          }

        } catch (error) {
          toast.error(
            error.response?.data?.message || "Payment Failed, Somthing went wrong!"
          );
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open();
  }

  const paymentRazorpay = async (planId) => {
    console.log("Buy clicked", planId);
    try {
      if (!user) {
        setShowLogin(true);
        return;
      }
      const { data } = await axios.post(backendUrl + "/api/user/pay-razorpay", { planId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });
      console.log("Order response:", data);

      if (data.success) {
        initPay(data.order);
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment Failed, Somthing went wrong!"
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="border border-gray-400 px-10 py-2 rounded-full mb-6"
      >
        Our Plans
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-3xl font-medium mb-6 sm:mb-10"
      >
        Choose The Plan
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.45 }}
            whileHover={{ scale: 1.04 }}
            className={`relative flex flex-col p-6 rounded-2xl border shadow-sm bg-white/70 backdrop-blur-md transition-all duration-300
        ${item.popular ? "border-purple-500 shadow-purple-200" : "border-gray-200"}
      `}
          >
            {item.popular && (
              <span className="absolute -top-3 right-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <div className="flex items-center gap-2 mb-4">
              <img src={assets.lock} alt="plan" className="w-5" />
              <h3 className="text-xl font-semibold text-gray-900">
                {item.name}
              </h3>
            </div>

            <p className="text-gray-600 mb-4">
              {item.description}
            </p>

            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900">
                {item.price}
              </p>
              <p className="text-sm text-gray-500">
                {item.totalCredits} credits
              </p>
              {item.bonusCredits > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Includes {item.bonusCredits} bonus credits
                </p>
              )}
            </div>

            <ul className="flex-1 space-y-2 mb-6">
              {item.features.map((feature, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-green-500">✔</span>
                  {feature}
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => paymentRazorpay(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mt-auto py-2.5 rounded-full font-medium transition
          ${item.popular
                  ? "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white hover:opacity-90"
                  : "bg-black text-white hover:opacity-90"
                }
        `}
            >
              {user ? item.buttonText : "Get Started"}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>

  )
}