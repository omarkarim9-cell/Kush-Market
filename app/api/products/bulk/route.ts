import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No products provided" }, { status: 400 })
    }

    const results = []
    const errors = []

    for (const p of products) {
      try {
        if (!p.name || !p.price) {
          errors.push(`Skipped row — missing name or price: ${JSON.stringify(p)}`)
          continue
        }

        const result = await sql`
          INSERT INTO products (name, description, price, image_url, category, in_stock)
          VALUES (
            ${p.name.trim()},
            ${p.description?.trim() || ""},
            ${parseFloat(p.price)},
            ${p.image_url?.trim() || ""},
            ${p.category?.trim() || ""},
            ${p.in_stock !== "false" && p.in_stock !== false}
          )
          RETURNING *
        `
        results.push(result[0])
      } catch (err) {
        errors.push(`Failed to insert "${p.name}": ${err}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.length,
      skipped: errors.length,
      errors,
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Bulk import failed"
    }, { status: 500 })
  }
}
