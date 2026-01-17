import { google } from 'googleapis'
import { Post, PostFormData } from '@/types'
import { generateId } from './utils'

const SHEET_RANGE = 'Sheet1!A:H'
const HEADERS = ['ID', 'Date', 'Time', 'Category', 'Caption', 'Image_URL', 'Status', 'Posted_At']

// Service account authentication
function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheets() {
  const auth = getAuth()
  return google.sheets({ version: 'v4', auth })
}

export async function getPosts(sheetId: string): Promise<Post[]> {
  const sheets = getSheets()

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: SHEET_RANGE,
    })

    const rows = response.data.values || []

    // Skip header row if present
    const dataRows = rows.length > 0 && rows[0][0] === 'ID' ? rows.slice(1) : rows

    return dataRows.map(row => ({
      id: row[0] || '',
      date: row[1] || '',
      time: row[2] || '',
      category: row[3] || '',
      caption: row[4] || '',
      imageUrl: row[5] || '',
      status: (row[6] as Post['status']) || 'Draft',
      postedAt: row[7] || null,
    })).filter(post => post.id) // Filter out empty rows
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export async function createPost(
  sheetId: string,
  data: PostFormData
): Promise<Post> {
  const sheets = getSheets()
  const id = generateId()

  const newPost: Post = {
    id,
    ...data,
    postedAt: null,
  }

  const row = [
    newPost.id,
    newPost.date,
    newPost.time,
    newPost.category,
    newPost.caption,
    newPost.imageUrl,
    newPost.status,
    newPost.postedAt || '',
  ]

  // First, ensure headers exist
  await ensureHeaders(sheetId)

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: SHEET_RANGE,
    valueInputOption: 'RAW',
    requestBody: {
      values: [row],
    },
  })

  return newPost
}

export async function updatePost(
  sheetId: string,
  postId: string,
  data: Partial<PostFormData>
): Promise<Post | null> {
  const sheets = getSheets()

  // Get all posts to find the row index
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: SHEET_RANGE,
  })

  const rows = response.data.values || []
  const rowIndex = rows.findIndex(row => row[0] === postId)

  if (rowIndex === -1) return null

  const existingRow = rows[rowIndex]
  const updatedPost: Post = {
    id: existingRow[0],
    date: data.date ?? existingRow[1],
    time: data.time ?? existingRow[2],
    category: data.category ?? existingRow[3],
    caption: data.caption ?? existingRow[4],
    imageUrl: data.imageUrl ?? existingRow[5],
    status: data.status ?? existingRow[6],
    postedAt: existingRow[7] || null,
  }

  const updatedRow = [
    updatedPost.id,
    updatedPost.date,
    updatedPost.time,
    updatedPost.category,
    updatedPost.caption,
    updatedPost.imageUrl,
    updatedPost.status,
    updatedPost.postedAt || '',
  ]

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `Sheet1!A${rowIndex + 1}:H${rowIndex + 1}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [updatedRow],
    },
  })

  return updatedPost
}

export async function deletePost(
  sheetId: string,
  postId: string
): Promise<boolean> {
  const sheets = getSheets()

  // Get all posts to find the row index
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: SHEET_RANGE,
  })

  const rows = response.data.values || []
  const rowIndex = rows.findIndex(row => row[0] === postId)

  if (rowIndex === -1) return false

  // Get spreadsheet to find sheet ID
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
  })

  const sheet = spreadsheet.data.sheets?.[0]
  const sheetGid = sheet?.properties?.sheetId || 0

  // Delete the row
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetGid,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  })

  return true
}

async function ensureHeaders(sheetId: string): Promise<void> {
  const sheets = getSheets()

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1:H1',
  })

  const firstRow = response.data.values?.[0]

  if (!firstRow || firstRow[0] !== 'ID') {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:H1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [HEADERS],
      },
    })
  }
}
