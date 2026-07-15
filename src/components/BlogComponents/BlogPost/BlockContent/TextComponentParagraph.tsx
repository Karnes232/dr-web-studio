import React from "react"
import { playfairDisplay } from "@/lib/fonts"

const TextComponentParagraph = ({
  paragraph,
  ParagraphClassName,
}: {
  paragraph: string
  ParagraphClassName: string
}) => {
  return (
    <div className="">
      <div className="flex flex-col justify-center max-w-5xl mx-5 lg:p-2 xl:mx-auto">
        <p
          className={`${playfairDisplay.className} lg:text-lg text-gray-700 dark:text-slate-200  ${ParagraphClassName}`}
        >
          {paragraph}
        </p>
      </div>
    </div>
  )
}

export default TextComponentParagraph
