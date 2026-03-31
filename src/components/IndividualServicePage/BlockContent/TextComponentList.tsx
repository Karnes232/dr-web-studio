import React from "react"
import * as motion from "motion/react-client"

interface TextComponentListProps {
  items: React.ReactNode[]
  listType: "bullet" | "number"
  ListClassName?: string
}

const TextComponentList: React.FC<TextComponentListProps> = ({
  items,
  listType,
  ListClassName = "",
}) => {
  const Tag = listType === "bullet" ? "ul" : "ol"
  const listStyle = listType === "bullet" ? "list-disc" : "list-decimal"

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
        <Tag className={`${listStyle} pl-6 space-y-2 ${ListClassName}`}>
          {items}
        </Tag>
      </motion.div>
    </div>
  )
}

export default TextComponentList
