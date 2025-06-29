import { client } from "@/sanity/lib/client"
import { PortableText } from "@portabletext/react"
import imageUrlBuilder from "@sanity/image-url"

import Image from "next/image"
import TextComponentHeading from "./TextComponentHeading"
import TextComponentParagraph from "./TextComponentParagraph"
import TextComponentList from "./TextComponentList"
const builder = imageUrlBuilder(client)

const components = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = builder.image(value).url()

      // Sanity images usually need to be accessed via .asset.url

      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || ""}
            width={1000}
            height={1000}
            className="w-full rounded-lg"
          />
          {/* <img
              src={imageUrl}
              alt={value.alt || ""}
              loading="lazy"
              className="w-full rounded-lg"
            /> */}
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-600">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      return (
        <a
          href={value.href}
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      )
    },
  },
  block: {
    // normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    normal: ({ children }: any) => (
      <TextComponentParagraph paragraph={children} ParagraphClassName="mb-4" />
    ),
    h1: ({ children }: any) => (
      <TextComponentHeading
        heading={children}
        headingNumber="h1"
        HeadingClassName="mb-4 mt-8"
      />
    ),
    h2: ({ children }: any) => (
      <TextComponentHeading
        heading={children}
        headingNumber="h2"
        HeadingClassName="mb-4 mt-8"
      />
    ),
    h3: ({ children }: any) => (
      <TextComponentHeading
        heading={children}
        headingNumber="h3"
        HeadingClassName="mb-4 mt-8"
      />
    ),
    h4: ({ children }: any) => (
      <TextComponentHeading
        heading={children}
        headingNumber="h4"
        HeadingClassName="mb-4 mt-8"
      />
    ),
    h5: ({ children }: any) => (
      <TextComponentHeading
        heading={children}
        headingNumber="h5"
        HeadingClassName="mb-4 mt-8"
      />
    ),
    h6: ({ children }: any) => (
      <TextComponentHeading
        heading={children}
        headingNumber="h6"
        HeadingClassName="mb-4 mt-8"
      />
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <TextComponentList
        items={children}
        listType="bullet"
        ListClassName="mb-4"
      />
    ),
    number: ({ children }: any) => (
      <TextComponentList
        items={children}
        listType="number"
        ListClassName="mb-4"
      />
    ),
  },
}

const BlockContent = ({ content }: { content: any }) => {
  if (!content) {
    return null
  }
  return (
    <>
      <div className="">
        <PortableText value={content} components={components} />
      </div>
    </>
  )
}

export default BlockContent
