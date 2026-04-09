"use client"

import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="bg-navy px-8 flex items-center justify-between h-[68px] sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <Image
          src="https://kush-edu.com/wp-content/uploads/2025/07/Ad-Kush-logo.jpg"
          alt="Kush logo"
          width={38}
          height={38}
          className="h-[38px] w-auto"
        />
        <span className="font-serif text-lg text-gold2 tracking-wide">KUSH Shop</span>
      </div>

      <ul className="hidden md:flex gap-8 list-none">
        <li>
          <Link href="/" className="text-gold2 text-sm font-normal">
            Shop
          </Link>
        </li>
        <li>
          <Link
            href="#how-it-works"
            className="text-white/75 text-sm font-normal hover:text-gold2 transition-colors"
          >
            How It Works
          </Link>
        </li>
        <li>
          <Link
            href="#order-form"
            className="text-white/75 text-sm font-normal hover:text-gold2 transition-colors"
          >
            Order
          </Link>
        </li>
        <li>
          <Link
            href="#payment"
            className="text-white/75 text-sm font-normal hover:text-gold2 transition-colors"
          >
            Payment
          </Link>
        </li>
        <li>
          <Link
            href="https://wa.me/971504207781"
            target="_blank"
            className="bg-gold text-navy px-5 py-2 rounded-md text-sm font-medium hover:bg-gold2 transition-colors"
          >
            WhatsApp Us
          </Link>
        </li>
      </ul>
    </nav>
  )
}