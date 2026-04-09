import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const orders = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      full_name, email, phone, country,
      product_name, quantity, payment_method,
      delivery_address, notes
    } = body

    if (!full_name || !email || !phone || !product_name) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO orders (
        full_name, email, phone, country,
        product_name, quantity, payment_method,
        delivery_address, notes, status
      ) VALUES (
        ${full_name}, ${email}, ${phone}, ${country},
        ${product_name}, ${quantity}, ${payment_method},
        ${delivery_address}, ${notes}, 'pending'
      )
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
