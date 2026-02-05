import credit from "./images/credit.png"
import profile_icon from "./images/profile_icon.png"
import star from "./images/star.png"
import star_grp from "./images/star_grp.png"
import img1 from "./images/img1.jpg"
import img2 from "./images/img2.jpg"
import lock from "./images/lock.png"
import close from "./images/close.png"

export const assets = {
    credit,
    profile_icon,
    star,
    star_grp,
    img1,
    img2,
    lock,
    close,

}
export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "$10",
    credits: 120,
    bonusCredits: 20,
    totalCredits: 120,
    description: "Perfect to get started with Pixora",
    features: [
      "120 image credits",
      "Standard image quality",
      "Fast generation",
      "Credits never expire",
    ],
    buttonText: "Buy Basic",
    popular: false,
  },
  {
    id: "advance",
    name: "Advanced",
    price: "$50",
    credits: 500,
    bonusCredits: 200,
    totalCredits: 700,
    description: "Best value for regular creators",
    features: [
      "700 image credits (500 + 200 bonus)",
      "High-quality images",
      "Faster generation",
      "Priority email support",
      "Credits never expire",
    ],
    buttonText: "Buy Advanced",
    popular: true, 
  },
  {
    id: "pro",
    name: "Pro",
    price: "$100",
    credits: 1300,
    bonusCredits: 300,
    totalCredits: 1600,
    description: "For power users and professionals",
    features: [
      "1600 image credits (1300 + 300 bonus)",
      "Ultra high-quality images",
      "Priority generation",
      "Priority support",
      "Credits never expire",
    ],
    buttonText: "Buy Pro",
    popular: false,
  },
];
