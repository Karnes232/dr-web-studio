import React from "react"
import * as motion from "motion/react-client"
import { Playfair_Display } from "next/font/google"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
})

const TextComponentHeading = ({
  heading,
  headingNumber,
  HeadingClassName,
}: {
  heading: string
  headingNumber: string
  HeadingClassName: string
}) => {
  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 3,
          delay: 0.3,
        }}
        className="flex flex-col justify-center max-w-5xl mx-5 lg:p-2 xl:mx-auto"
      >
        {headingNumber === "h1" && (
          <h1
            className={`${playfairDisplay.className} text-gray-700 dark:text-white my-5 2xl:mb-2 2xl:mt-10 text-3xl md:text-4xl ${HeadingClassName}`}
          >
            {heading}
          </h1>
        )}
        {headingNumber === "h2" && (
          <h2
            className={`${playfairDisplay.className}  text-gray-700 dark:text-white my-5 2xl:mb-2 2xl:mt-10 text-2xl md:text-3xl ${HeadingClassName}`}
          >
            {heading}
          </h2>
        )}
        {headingNumber === "h3" && (
          <h3
            className={`${playfairDisplay.className}  text-gray-700 dark:text-white my-5 2xl:mb-2 2xl:mt-10 text-2xl md:text-3xl  ${HeadingClassName}`}
          >
            {heading}
          </h3>
        )}
        {headingNumber === "h4" && (
          <h4
            className={`${playfairDisplay.className}  text-gray-700 dark:text-white my-5 2xl:mb-2 2xl:mt-10 text-xl md:text-2xl ${HeadingClassName}`}
          >
            {heading}
          </h4>
        )}
        {headingNumber === "h5" && (
          <h5
            className={`${playfairDisplay.className}  text-gray-700 dark:text-white my-5 2xl:mb-2 2xl:mt-10 text-xl md:text-2xl  ${HeadingClassName}`}
          >
            {heading}
          </h5>
        )}
        {headingNumber === "h6" && (
          <h6
            className={`${playfairDisplay.className}  text-gray-700 dark:text-white my-5 2xl:mb-2 2xl:mt-10 text-lg md:text-xl  ${HeadingClassName}`}
          >
            {heading}
          </h6>
        )}
      </motion.div>
    </div>
  )
}

export default TextComponentHeading
