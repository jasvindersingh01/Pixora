import { useContext, useRef, useState, useEffect } from "react";
import { assets } from "../assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

export default function GenerateImage() {

  const [image, setImage] = useState(assets.img1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(" ")
  const { generateImage } = useContext(AppContext);
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (input) {
      const image = await generateImage(input)
      if (image) {
        setIsImageLoaded(true)
        setImage(image)
      }
    }
    setLoading(false)
    setInput(" ")
  }

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col justify-center items-center min-h-[90vh] px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <motion.img
            src={image}
            alt="Generated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-sm rounded-xl shadow-lg"
          />

          {loading && (
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-b-xl"
            />
          )}
        </div>

        {loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-sm text-gray-600 animate-pulse"
          >
            Generating your image…
          </motion.p>
        )}
      </motion.div>

      {!isImageLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex w-full max-w-xl items-center bg-white border border-gray-200 shadow-md mt-10 rounded-full px-2"
        >
          <input
            ref={inputRef}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe the image you want to generate…"
            className="flex-1 bg-transparent outline-none px-4 py-3 text-gray-800 placeholder-gray-400"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-8 sm:px-12 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Generate
          </motion.button>
        </motion.div>
      )}

      {isImageLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex gap-4 flex-wrap justify-center mt-10"
        >
          <motion.button
            onClick={() => {
              setIsImageLoaded(false);
              setInput("");
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-gray-300 px-8 py-3 rounded-full text-gray-800 hover:bg-gray-100 transition"
          >
            Generate Another
          </motion.button>

          <motion.a
            href={image}
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-zinc-900 text-white px-10 py-3 rounded-full hover:opacity-90 transition"
          >
            Download
          </motion.a>
        </motion.div>
      )}
    </motion.form>


  )
}