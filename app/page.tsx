"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Logo from "./components/Logo";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const onSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const honeyPot = document.getElementById(
        "name__confirm",
      ) as HTMLInputElement;
      if (honeyPot?.value) {
        // catch bots
        return;
      }

      const requestBody = { q: search };
      const queryParams = new URLSearchParams(requestBody).toString();
      router.push(`/search?${queryParams}`);
    },
    [router, search],
  );

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="lg:w-[800px] lg:h-[800px] lg:gap-12 gap-6 w-[75vw] h-[75vw] rounded-full bg-[var(--secondary)] flex flex-col items-center justify-center">
        <div className="relative lg:w-[470px] lg:h-[201px] w-3/4 h-[32%]">
          <Logo />
        </div>
        <form
          className="flex flex-col md:gap-6 gap-2 items-center sm:items-start"
          onSubmit={onSubmit}
        >
          <h1>Explore our catalog</h1>
          <SearchBar setSearch={setSearch} />
        </form>
      </div>
    </main>
  );
}
