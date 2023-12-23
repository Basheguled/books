import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../components/Logo";
import noImage from "../../public/no-image.svg";

type Book = {
  kind: string;
  id: string;
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

async function getBooks(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<{ totalItems: number; books: Book[] }> {
  const apiKey = "AIzaSyA7vhetq2aHQOr2kV3aHUylD_4-rWGfD2A";
  const requestBody = { ...searchParams, key: apiKey, maxResults: "20" };
  const queryParams = new URLSearchParams(requestBody).toString();

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${queryParams}`
  );
  const data = await response.json();
  return { totalItems: data.totalItems, books: data.items };
}

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

const Description = ({ book }: { book: Book }) => {
  return (
    <div className="flex flex-col gap-2 max-w-[600px]">
      <h3 className="text-ellipsis line-clamp-2">
        {book.volumeInfo.title}{" "}
        {book.saleInfo.retailPrice &&
          `— \$${book.saleInfo.retailPrice?.amount}`}
      </h3>
      {book.volumeInfo.authors?.length && (
        <p className="opacity-65">by {book.volumeInfo.authors[0]}</p>
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
          <div className="w-[150px]">
            <Image
              alt="book cover"
              layout="responsive"
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

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const searchQuery = searchParams.q;
  const { totalItems, books } = await getBooks(searchParams);

  return (
    <main className="flex h-full w-full flex-col items-start justify-start">
      <NavBar />
      <div className="w-full py-16 px-24 flex flex-col gap-10">
        <h2>
          {totalItems} Results for &quot;{searchQuery}&quot;
        </h2>
        {books && books.map((book) => <Entry key={book.id} book={book} />)}
      </div>
    </main>
  );
};

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={<h2>Loading results for {searchParams.q}...</h2>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
