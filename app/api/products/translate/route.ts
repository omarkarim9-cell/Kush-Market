import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { id, name, description } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ error: "Product id and name required" }, { status: 400 })
    }

    // Translate name
    const nameRes = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(name)}&langpair=en|ar`,
      { cache: "no-store" }
    )
    const nameData = await nameRes.json()
    const name_ar = nameData.responseData?.translatedText || name

    // Translate description
    let description_ar = ""
    if (description) {
      const descRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(description)}&langpair=en|ar`,
        { cache: "no-store" }
      )
      const descData = await descRes.json()
      description_ar = descData.responseData?.translatedText || description
    }

    if (!name_ar) {
      return NextResponse.json({ error: "Translation failed" }, { status: 500 })
    }

    // Save to DB
    const result = await sql`
      UPDATE products
      SET name_ar = ${name_ar},
          description_ar = ${description_ar},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      name_ar,
      description_ar,
      product: result[0],
    })

  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Translation failed"
    }, { status: 500 })
  }
}
