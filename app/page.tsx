import { redirect } from 'next/navigation'
import { getDefaultBrand } from '@/lib/brands'

export default function Home() {
  const defaultBrand = getDefaultBrand()

  if (defaultBrand) {
    redirect(`/${defaultBrand.slug}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">No brands configured</h1>
        <p className="text-gray-600">
          Please add brand configuration to your environment variables.
        </p>
      </div>
    </div>
  )
}
