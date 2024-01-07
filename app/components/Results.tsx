"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroller";
import noImage from "../../public/no-image.svg";
import SearchBar from "./SearchBar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Book = {
  etag: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    averageRating?: 3;
    ratingsCount?: 9;
    imageLinks?: {
      thumbnail?: string;
    };
    infoLink: string;
  };
  saleInfo: {
    retailPrice?: { amount?: number; currencyCode?: string };
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
    <div className="lg:w-[774px] p-4 rounded hover:bg-[var(--secondary)]">
      <a
        href={book.volumeInfo.infoLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex flex-row gap-6">
          <div className="min-w-[150px] max-w-[150px] max-h-[230px]">
            <Image
              alt="book cover"
              className="object-contain w-full relative h-auto"
              priority
              src={
                book.volumeInfo.imageLinks?.thumbnail
                  ? book.volumeInfo.imageLinks.thumbnail
                  : noImage
              }
              width={200}
              height={200}
            />
          </div>
          <Description book={book} />
        </div>
      </a>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="lg:w-[774px] p-4 rounded">
      <div className="animate-pulse flex flex-row gap-6">
        <div className="w-[160px] h-[240px] bg-slate-300" />
        <div className="flex flex-col gap-2 lg:w-[600px] w-4/5">
          <div className="h-7 w-3/4 bg-slate-300 rounded" />
          <div className="h-7 w-1/4 bg-slate-300 rounded" />

          <div className="h-7 w-full bg-slate-300 rounded" />
          <div className="h-7 w-full bg-slate-300 rounded" />
          <div className="h-7 w-full bg-slate-300 rounded" />
        </div>
      </div>
    </div>
  );
};

async function getBooks({
  searchQuery,
  page,
}: {
  searchQuery: string;
  page?: number;
}) {
  if (!searchQuery) {
    return { items: [], totalItems: 0 };
  }

  const key = process.env.NEXT_PUBLIC_KEY ?? "";
  const startIndex = page ? String((page - 1) * 10) : "0";
  const requestBody = { q: searchQuery, key, maxResults: "10", startIndex };
  const queryParams = new URLSearchParams(requestBody).toString();
  const fields =
    "fields=totalItems,items(etag,volumeInfo(title,authors,publishedDate,description,averageRating,ratingsCount,imageLinks/thumbnail,infoLink),saleInfo)";
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${queryParams}&${fields}`,
  );

  if (!response.ok) {
    return { items: [], totalItems: 0 };
  }

  const data = await response.json();
  return { books: data.items ?? [], totalItems: data.totalItems ?? 0 };
}

const Results = ({ searchQuery }: { searchQuery: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const hasInitialData = useRef(false);
  const isFetching = useRef(false);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState<Book[]>([]);

  const fetchInitialData = useCallback(async () => {
    const { books, totalItems } = await getBooks({ searchQuery });
    setItems(books);
    setTotalItems(totalItems);
    hasInitialData.current = true;
  }, [searchQuery]);

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadMore = useCallback(
    async (page: number) => {
      if (!isFetching.current && searchQuery) {
        try {
          isFetching.current = true;

          const { books } = await getBooks({ searchQuery, page });
          setItems((prev) => [...prev, ...books]);
        } finally {
          isFetching.current = false;
        }
      }
    },
    [searchQuery],
  );

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const honeyPot = document.getElementById(
        "name__confirm",
      ) as HTMLInputElement;
      if (honeyPot?.value) {
        // catch bots
        return;
      }

      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      push(`${pathname}?${params.toString()}`);
      hasInitialData.current = false;
    },
    [pathname, push, search, searchParams],
  );

  const content = useMemo(() => {
    if (!hasInitialData.current) {
      return (
        <>
          <h2>Loading ...</h2>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </>
      );
    }

    if (!items?.length && hasInitialData.current) {
      return <h2>No results for &quot;{searchQuery}&quot;</h2>;
    }

    return (
      <div className="flex flex-col items-center sm:items-start gap-6">
        <h2>
          {totalItems} Results for &quot;{searchQuery}&quot;
        </h2>
        <InfiniteScroll
          hasMore
          pageStart={1}
          loadMore={loadMore}
          loader={<h2 className="py-6">Loading ...</h2>}
        >
          {items && items.map((book) => <Entry key={book.etag} book={book} />)}
        </InfiniteScroll>
      </div>
    );
  }, [items, loadMore, searchQuery, totalItems]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <SearchBar
          setSearch={setSearch}
          defaultValue={searchParams.get("q")?.toString()}
        />
      </form>
      {content}
    </>
  );
};

export default Results;
