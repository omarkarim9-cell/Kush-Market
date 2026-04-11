import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id, name, description } = await request.json()

    if (!id || !name) {
      return NextResponse.json({ error: "Product id and name required" }, { status: 400 })
    }

    // 1. Get Google API Key from Environment Variables
    // Make sure this matches the key name you set in Vercel
    const apiKey = process.env.GOOGLE_TRANSLATION_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_TRANSLATION_API_KEY not configured" }, { status: 500 })
    }

    // 2. Call Google Gemini API (Using your Google Cloud credit)
    const response = await fetch(`https://googleapis.com{apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following product name and description to Arabic. Return ONLY a valid JSON object with keys "name_ar" and "description_ar". No explanation, no markdown code blocks, just the raw JSON object.

            Product Name: ${name}
            Description: ${description || "No description"}`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google API error:", errorText)
      return NextResponse.json({ error: "Translation API failed" }, { status: 500 })
    }

    const data = await response.json()
    
    // 3. Extract text from Google's response structure
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // 4. Clean the output (remove markdown blocks if Gemini adds them)
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

    // 5. Save to DB
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
