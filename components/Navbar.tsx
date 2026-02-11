'use client'

import Link from "next/link"
import Image from "next/image"
import posthog from 'posthog-js'

const Navbar = () => {
  return (
    <header>
        <nav style={{ height: '130px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #222', padding: '0 20px' }}>
        <Link href='/' className="logo" onClick={() => posthog.capture('navbar_logo_clicked', { target_url: '/' })}>
            <Image src="/icons/logo-v2.png" alt="logo" width={180} height={150} />
        </Link>

        <ul>
            <Link href="/" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Home', target_url: '/' })}>
                Home
            </Link>
            <Link href="/" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Events', target_url: '/' })}>
                Events
            </Link>
            <Link href="/" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Create', target_url: '/' })}>
                Create
            </Link>
        </ul>
        </nav>
    </header>
  )
}

export default Navbar
