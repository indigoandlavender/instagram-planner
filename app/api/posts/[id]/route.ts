import { NextRequest, NextResponse } from 'next/server'
import { updatePost, deletePost } from '@/lib/google-sheets'
import { getBrandBySlug } from '@/lib/brands'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const post = await updatePost(brand.sheetId, params.id, data)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const brandSlug = request.nextUrl.searchParams.get('brand')
  if (!brandSlug) {
    return NextResponse.json({ error: 'Brand slug required' }, { status: 400 })
  }

  const brand = getBrandBySlug(brandSlug)
  if (!brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  try {
    const success = await deletePost(brand.sheetId, params.id)

    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
