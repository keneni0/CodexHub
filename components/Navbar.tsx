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

                <ul style={{ display: 'flex', gap: 20, marginLeft: 24, listStyle: 'none', padding: 0, margin: 0 }}>
                        <li>
                            <Link href="/" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Home', target_url: '/' })}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/events" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Events', target_url: '/events' })}>
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link href="/create" onClick={() => posthog.capture('navbar_link_clicked', { link_text: 'Create', target_url: '/create' })}>
                                Create
                            </Link>
                        </li>
                </ul>
        </nav>
    </header>
  )
}

export default Navbar
