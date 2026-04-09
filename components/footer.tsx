import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-navy text-white/50 text-center py-6 px-8 text-[13px]">
      <p>
        {"© 2025 Kush Consultancy. All rights reserved. "}
        <Link href="https://kush-edu.com" className="text-gold hover:underline">
          kush-edu.com
        </Link>
      </p>
    </footer>
  )
}
