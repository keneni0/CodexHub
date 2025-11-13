import Link from "next/link"
import Image from "next/image"

const Navbar = () => {
  return (
    <header>
        <nav style={{ height: '130px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #222', padding: '0 20px' }}>
        <Link href='/' className="logo">
            <Image src="/icons/logo-v2.png" alt="logo" width={180} height={150} />
        </Link>

        <ul>
            <Link href="/">Home</Link>
            <Link href="/">Events</Link>
            <Link href="/">Create</Link>
        </ul>
        </nav>
    </header>
  )
}

export default Navbar