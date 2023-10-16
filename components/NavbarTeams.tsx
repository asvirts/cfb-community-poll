import Link from "next/link";

export default function NavbarTeams() {
  return (
    <nav className="bg-slate-400 flex justify-center py-2 mb-2">
      <Link href="/teams" className="mx-2 hover:text-slate-600">
        All
      </Link>
      <Link href="/teams/conference/acc" className="mx-2 hover:text-slate-600">
        ACC
      </Link>
      <Link
        href="/teams/conference/american"
        className="mx-2 hover:text-slate-600"
      >
        American
      </Link>
      <Link
        href="/teams/conference/big12"
        className="mx-2 hover:text-slate-600"
      >
        Big 12
      </Link>
      <Link
        href="/teams/conference/bigten"
        className="mx-2 hover:text-slate-600"
      >
        Big Ten
      </Link>
      <Link href="/teams/conference/cusa" className="mx-2 hover:text-slate-600">
        C-USA
      </Link>
      <Link
        href="/teams/conference/independents"
        className="mx-2 hover:text-slate-600"
      >
        Independents
      </Link>
      <Link href="/teams/conference/mac" className="mx-2 hover:text-slate-600">
        MAC
      </Link>
      <Link href="/teams/conference/mwc" className="mx-2 hover:text-slate-600">
        MWC
      </Link>
      <Link
        href="/teams/conference/pac12"
        className="mx-2 hover:text-slate-600"
      >
        PAC 12
      </Link>
      <Link href="/teams/conference/sec" className="mx-2 hover:text-slate-600">
        SEC
      </Link>
      <Link
        href="/teams/conference/sunbelt"
        className="mx-2 hover:text-slate-600"
      >
        Sun Belt
      </Link>
    </nav>
  );
}
