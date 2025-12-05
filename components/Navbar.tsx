'use client'

import Link from "next/link"
import Image from "next/image"
import posthog from 'posthog-js'

const Navbar = () => {
  return (
    <header>
        <nav style={{ height: '90px', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', gap: '16px' }}>
        <Link href='/' className="logo" onClick={() => posthog.capture('navbar_logo_clicked', { target_url: '/' })}>
            <Image src="/icons/logo-v2.png" alt="logo" width={140} height={110} />
        </Link>

        <ul style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link href="/" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Home', target_url: '/' })}>
                Home
            </Link>
            <Link href="/" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Events', target_url: '/' })}>
                Events
            </Link>
            <Link href="/create" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Create', target_url: '/create' })}>
                Create
            </Link>
        </ul>
        </nav>
    </header>
  )
}

export default Navbar
