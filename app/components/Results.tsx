"use client";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroller";
import noImage from "../../public/no-image.svg";
import SearchBar from "./SearchBar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type Book = {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    printType?: string;
    categories?: string[];
    averageRating?: 3;
    ratingsCount?: 9;
    imageLinks?: {
      thumbnail?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink: string;
  };
  saleInfo: {
    country?: string;
    saleability?: string;
    isEbook?: boolean;
    listPrice?: { amount?: number; currencyCode?: string };
    retailPrice?: { amount?: number; currencyCode?: string };
    buyLink?: string;
  };
};

const Description = ({ book }: { book: Book }) => {
  return (
    <div className="flex flex-col gap-2 max-w-[600px]">
      <h3 className="text-ellipsis line-clamp-2">
        {book.volumeInfo.title}{" "}
        {book.saleInfo.retailPrice &&
          `— \$${book.saleInfo.retailPrice?.amount}`}
      </h3>
      {book.volumeInfo.authors?.length && (
        <p className="text-slate-500">by {book.volumeInfo.authors[0]}</p>
      )}
      <strong>
        {book.volumeInfo.averageRating &&
          book.volumeInfo.ratingsCount &&
          `${book.volumeInfo.averageRating}⭐ avg rating — ${
            book.volumeInfo.ratingsCount
          } rating${book.volumeInfo.ratingsCount > 1 ? "s" : ""} — `}{" "}
        {book.volumeInfo.publishedDate &&
          `published ${book.volumeInfo.publishedDate.substring(0, 4)}`}
      </strong>
      <p className="h-20 text-ellipsis line-clamp-3">
        {book.volumeInfo.description}
      </p>
    </div>
  );
};

const Entry = ({ book }: { book: Book }) => {
  return (
    <div className="w-[774px] p-4 rounded hover:bg-[var(--secondary)]">
      <a
        href={book.volumeInfo.infoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex flex-row gap-6">
          <div className="relative w-[150px] min-w-[150px]">
            <Image
              alt="book cover"
              fill
              sizes="(max-width: 1200px) 100vw, 100vw"
              src={
                book.volumeInfo.imageLinks?.thumbnail
                  ? book.volumeInfo.imageLinks.thumbnail
                  : noImage
              }
            />
          </div>
          <Description book={book} />
        </div>
      </a>
    </div>
  );
};

const Results = ({
  books,
  searchQuery,
  totalItems,
}: {
  books: Book[];
  searchQuery: string;
  totalItems: number;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isFetching = useRef(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([books]);
  const results = items.flat();

  const loadMore = async (page: number) => {
    if (!isFetching.current && searchQuery) {
      try {
        isFetching.current = true;

        const startIndex = String((page - 1) * 10);
        const key = process.env.NEXT_PUBLIC_KEY ?? "";
        const requestBody = {
          q: searchQuery,
          key,
          maxResults: "10",
          startIndex,
        };
        const queryParams = new URLSearchParams(requestBody).toString();

        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?${queryParams}`
        );
        const data = await response.json();
        setItems((prev) => [...prev, data.items]);
      } finally {
        isFetching.current = false;
      }
    }
  };

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, search, searchParams]
  );

  if (!results.length) {
    return <h2>No results for &quot;{searchQuery}&quot;</h2>;
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <SearchBar
          setSearch={setSearch}
          defaultValue={searchParams.get("q")?.toString()}
        />
      </form>
      <h2>
        {totalItems} Results for &quot;{searchQuery}&quot;
      </h2>
      <InfiniteScroll
        hasMore
        pageStart={0}
        loadMore={loadMore}
        loader={<h2 className="py-6">Loading ...</h2>}
      >
        {results &&
          results.map((book) => <Entry key={book.etag} book={book} />)}
      </InfiniteScroll>
    </>
  );
};

export default Results;
