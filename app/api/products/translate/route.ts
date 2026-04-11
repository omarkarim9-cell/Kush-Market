import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id, name, description } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ error: "Product id and name required" }, { status: 400 })
    }

    // Call Claude API to translate
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Translate the following product name and description to Arabic. Return ONLY a JSON object with keys "name_ar" and "description_ar". No explanation, no markdown, just the raw JSON.

Product Name: ${name}
Description: ${description || ""}`,
          },
        ],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ""

    // Parse JSON from Claude response
    const clean = text.replace(/```json|```/g, "").trim()
    const translated = JSON.parse(clean)

    // Save to DB
    const result = await sql`
      UPDATE products
      SET name_ar = ${translated.name_ar},
          description_ar = ${translated.description_ar},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({
      name_ar: translated.name_ar,
      description_ar: translated.description_ar,
      product: result[0],
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
