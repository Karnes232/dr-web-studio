"use client"

import dynamic from "next/dynamic"
import type { CustomPaymentData } from "@/sanity/queries/payment/customPayment"

const CheckoutContent = dynamic(
  () => import("@/components/CheckoutComponents/CheckoutContent"),
  { ssr: false },
)

export default function CheckoutContentDynamic({
  customPaymentData,
}: {
  customPaymentData: CustomPaymentData
}) {
  return <CheckoutContent customPaymentData={customPaymentData} />
}
