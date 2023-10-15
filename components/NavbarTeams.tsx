import Link from "next/link";

export default function NavbarTeams() {
  return (
    <nav className="bg-slate-400 flex justify-center container">
      <Link href="/teams/acc">ACC</Link>
      <Link href="/teams/sec">SEC</Link>
    </nav>
  );
}
