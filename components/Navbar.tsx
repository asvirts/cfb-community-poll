import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-400 flex justify-center container">
      <Link href="/">Home</Link>
      <Link href="/teams">Teams</Link>
    </nav>
  );
}
