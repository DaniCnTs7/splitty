'use client'

import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe-client'

export default function StripeWrapper({ children }: { children: React.ReactNode }) {
  return <Elements stripe={stripePromise}>{children}</Elements>
}
