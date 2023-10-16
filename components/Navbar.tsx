import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-400 flex justify-center py-2 font-bold">
      <Link href="/" className="mx-2 hover:text-slate-600">
        Home
      </Link>
      <Link href="/teams" className="mx-2 hover:text-slate-600">
        Teams
      </Link>
    </nav>
  );
}
