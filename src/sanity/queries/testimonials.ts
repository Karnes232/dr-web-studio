import { client } from "../lib/client"

export const allTestimonialsQuery = `
*[_type == "testimonial"] | order(_createdAt desc) {
  quote,
  author,
  company,
  rating
}`

export interface Testimonial {
  quote: {
    en: string
    es: string
  }
  author: string
  company: string
  rating: number
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return await client.fetch(allTestimonialsQuery)
}

// Query for fetching a single testimonial by ID
export const testimonialByIdQuery = `
*[_type == "testimonial" && _id == $id][0] {
  quote,
  author,
  company,
  rating
}`

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  return await client.fetch(testimonialByIdQuery, { id })
} 