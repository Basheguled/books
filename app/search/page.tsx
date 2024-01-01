import Link from "next/link";
import Logo from "../components/Logo";
import Results from "../components/Results";

const NavBar = () => {
  return (
    <nav className="w-full h-[80px] bg-[var(--secondary)]">
      <div className="h-full w-full flex justify-between items-center px-14 py-2">
        <Link
          className="hover:bg-black hover:text-[var(--secondary)] p-4 rounded"
          href="/"
        >
          <h2>HOME</h2>
        </Link>
        <div className="relative w-[164px] h-[70px] hidden xs:block">
          <Logo />
        </div>
      </div>
    </nav>
  );
};

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <main className="flex h-full w-full flex-col items-start justify-start">
      <NavBar />
      <div className="w-full py-16 px-2 sm:px-12 lg:px-24 flex flex-col gap-10">
        <Results searchQuery={searchParams.q ?? ""} />
      </div>
    </main>
  );
}
