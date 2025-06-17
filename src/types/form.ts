export interface FormData {
  websiteType: string
  pages: number
  designStyle: string
  features: string[]
  budget: string
  timeline: string
  contentStatus: string
  languages: string[]
  contact: {
    name: string
    email: string
    phone: string
    company: string
    message: string
  }
  [key: string]: any // For any additional properties
}
