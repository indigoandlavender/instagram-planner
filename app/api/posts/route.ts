import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPosts, createPost } from '@/lib/google-sheets'
import { getBrandBySlug } from '@/lib/brands'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const brandSlug = request.nextUrl.searchParams.get('brand')
  if (!brandSlug) {
    return NextResponse.json({ error: 'Brand slug required' }, { status: 400 })
  }

  const brand = getBrandBySlug(brandSlug)
  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  try {
    const posts = await getPosts(session.accessToken, brand.sheetId)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const brandSlug = request.nextUrl.searchParams.get('brand')
  if (!brandSlug) {
    return NextResponse.json({ error: 'Brand slug required' }, { status: 400 })
  }

  const brand = getBrandBySlug(brandSlug)
  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  try {
    const data = await request.json()
    const post = await createPost(session.accessToken, brand.sheetId, data)
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
