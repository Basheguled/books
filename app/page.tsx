"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const onSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const requestBody = { q: search };
      const queryParams = new URLSearchParams(requestBody).toString();
      console.log("search: ", search);

      router.push(`/search?${queryParams}`);
    },
    [router, search]
  );

  return (
    <main className="flex h-full flex-col items-center justify-center p-24">
      <form
        className="w-full flex flex-col items-start justify-center p-24 gap-6"
        onSubmit={onSubmit}
      >
        <h1>Book Search</h1>
        <SearchBar setSearch={setSearch} />
      </form>
    </main>
  );
}
