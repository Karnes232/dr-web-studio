import { client } from "@/sanity/lib/client"

export const contactFormQuery = `
  *[_type == "contactForm"][0] {
    title,
    description,
    formFields {
      fullName {
        label,
        placeholder
      },
      email {
        label,
        placeholder
      },
      phone {
        label,
        placeholder
      },
      company {
        label,
        placeholder
      },
      message {
        label,
        placeholder
      }
    }
  }
`

export async function getContactForm(): Promise<ContactFormType> {
  return client.fetch(contactFormQuery)
}

export interface ContactFormType {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  formFields: {
    fullName: {
      label: {
        en: string
        es: string
      }
      placeholder: {
        en: string
        es: string
      }
    }
    email: {
      label: {
        en: string
        es: string
      }
      placeholder: {
        en: string
        es: string
      }
    }
    phone: {
      label: {
        en: string
        es: string
      }
      placeholder: {
        en: string
        es: string
      }
    }
    company: {
      label: {
        en: string
        es: string
      }
      placeholder: {
        en: string
        es: string
      }
    }
    message: {
      label: {
        en: string
        es: string
      }
      placeholder: {
        en: string
        es: string
      }
    }
  }
}
