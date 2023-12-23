"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../public/logo.svg";
import SearchBar from "./components/SearchBar";

const Logo = () => <Image priority={true} src={logo} alt="logo" />;

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const onSubmit = React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const requestBody = { q: search };
      const queryParams = new URLSearchParams(requestBody).toString();
      router.push(`/search?${queryParams}`);
    },
    [router, search]
  );

  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-24">
      <div className="w-[800px] h-[800px] rounded-full bg-[var(--secondary)] flex flex-col items-center justify-center gap-12">
        <Logo />
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <h1>Explore our catalog</h1>
          <SearchBar setSearch={setSearch} />
        </form>
      </div>
    </main>
  );
}
