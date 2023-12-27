import { Suspense } from "react";
import Link from "next/link";
import Logo from "../components/Logo";
import Results, { type Book } from "../components/Results";

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
        <Logo height={50} width={164} />
      </div>
    </nav>
  );
};

async function getBooks(searchParams: {
  [key: string]: string | undefined;
}): Promise<{ totalItems: number; books: Book[] }> {
  const { q } = searchParams;

  if (!q) {
    return { totalItems: 0, books: [] };
  }
  const key = process.env.NEXT_PUBLIC_KEY ?? "";
  const requestBody = { q, key, maxResults: "10" };
  const queryParams = new URLSearchParams(requestBody).toString();

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${queryParams}`
  );

  if (!response.ok) {
    return { totalItems: 0, books: [] };
  }

  const data = await response.json();
  return { totalItems: data.totalItems, books: data.items };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { totalItems, books } = await getBooks(searchParams);

  return (
    <main className="flex h-full w-full flex-col items-start justify-start">
      <NavBar />
      <div className="w-full py-16 px-24 flex flex-col gap-10">
        <Suspense
          key={searchParams.q}
          fallback={<h2>Loading results for {searchParams.q}...</h2>}
        >
          <Results
            totalItems={totalItems}
            books={books}
            searchQuery={searchParams.q ?? ""}
          />
        </Suspense>
      </div>
    </main>
  );
}
