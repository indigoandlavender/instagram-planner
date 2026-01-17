import { NextResponse } from 'next/server'
import { getBrands } from '@/lib/brands'

export async function GET() {
  const brands = getBrands()
  return NextResponse.json(brands)
}
