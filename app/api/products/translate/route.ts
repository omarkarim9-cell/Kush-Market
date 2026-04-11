import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { id, name, description } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ error: "Product id and name required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_TRANSLATION_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_TRANSLATION_API_KEY not configured" }, { status: 500 })
    }

    // ✅ Fixed URL with correct template literal and full endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate to Arabic. Return ONLY a valid JSON object with keys "name_ar" and "description_ar". No markdown, no explanation, just raw JSON.
Product Name: ${name}
Description: ${description || "No description"}`
            }]
          }]
        })
      }
    )

    // ✅ Fixed: parse response before using it
    const data = await response.json()

    if (!response.ok) {
      console.error("Gemini API error:", data)
      return NextResponse.json({ error: data.error?.message || "Gemini API error" }, { status: 500 })
    }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Clean markdown if Gemini adds it
    let clean = text.trim()
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }
    clean = clean.trim()

    let translated
    try {
      translated = JSON.parse(clean)
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", text)
      return NextResponse.json({ error: "Failed to parse translation response" }, { status: 500 })
    }

    if (!translated.name_ar) {
      return NextResponse.json({ error: "Translation missing name_ar" }, { status: 500 })
    }

    // Save to DB
    const result = await sql`
      UPDATE products
      SET name_ar = ${translated.name_ar},
          description_ar = ${translated.description_ar || ""},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      name_ar: translated.name_ar,
      description_ar: translated.description_ar,
      product: result[0],
    })

  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Translation failed"
    }, { status: 500 })
  }
}