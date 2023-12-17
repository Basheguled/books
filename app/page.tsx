"use client";

import * as React from "react";
import { Typography } from "@mui/material";
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form className="w-full p-24" onSubmit={onSubmit}>
        <Typography variant="h2">Book Search</Typography>
        <SearchBar setSearch={setSearch} />
      </form>
    </main>
  );
}
