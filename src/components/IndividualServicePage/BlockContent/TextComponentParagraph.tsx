import React from "react"
import * as motion from "motion/react-client"
//import { Playfair_Display } from "next/font/google"

// const playfairDisplay = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "700"],
// })

const TextComponentParagraph = ({
  paragraph,
  ParagraphClassName,
}: {
  paragraph: string
  ParagraphClassName: string
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
        <p
          className={`lg:text-lg text-gray-700 dark:text-white ${ParagraphClassName}`}
        >
          {paragraph}
        </p>
      </motion.div>
    </div>
  )
}

export default TextComponentParagraph
