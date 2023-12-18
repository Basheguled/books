import { Suspense } from "react";
import SearchBar from "../components/SearchBar";
import Image from "next/image";

/*
{
  kind: 'books#volume',
  id: 'Mug4uI3ZGo8C',
  etag: 'w71PBWW6tOo',
  selfLink: 'https://www.googleapis.com/books/v1/volumes/Mug4uI3ZGo8C',
  volumeInfo: {
    title: 'The World of the Hunger Games',
    authors: [ 'Kate Egan' ],
    publisher: 'Scholastic Inc.',
    publishedDate: '2012-03-23',
    description: 'The definitive, richly illustrated, full-color guide to all the districts of Panem, all the participants in the Hunger Games, and the life and home of Katniss Everdeen.Welcome to Panem, the world of the Hunger Games. This is the definitive, richly illustrated, full-color guide to all the districts of Panem, all the participants in The Hunger Games, and the life and home of Katniss Everdeen. A must-have for fans of both The Hunger Games novels and the new Hunger Games film.',
    industryIdentifiers: [ [Object], [Object] ],
    readingModes: { text: true, image: true },
    pageCount: 151,
    printType: 'BOOK',
    categories: [ 'Young Adult Fiction' ],
    averageRating: 3,
    ratingsCount: 9,
    maturityRating: 'NOT_MATURE',
    allowAnonLogging: true,
    contentVersion: '4.10.13.0.preview.3',
    panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
    imageLinks: {
      smallThumbnail: 'http://books.google.com/books/content?id=Mug4uI3ZGo8C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
      thumbnail: 'http://books.google.com/books/content?id=Mug4uI3ZGo8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
    },
    language: 'en',
    previewLink: 'http://books.google.com/books?id=Mug4uI3ZGo8C&printsec=frontcover&dq=hunger+games&hl=&cd=1&source=gbs_api',
    infoLink: 'https://play.google.com/store/books/details?id=Mug4uI3ZGo8C&source=gbs_api',
    canonicalVolumeLink: 'https://play.google.com/store/books/details?id=Mug4uI3ZGo8C'
  },
  saleInfo: {
    country: 'US',
    saleability: 'FOR_SALE',
    isEbook: true,
    listPrice: { amount: 5.99, currencyCode: 'USD' },
    retailPrice: { amount: 5.99, currencyCode: 'USD' },
    buyLink: 'https://play.google.com/store/books/details?id=Mug4uI3ZGo8C&rdid=book-Mug4uI3ZGo8C&rdot=1&source=gbs_api',
    offers: [ [Object] ]
  },
  accessInfo: {
    country: 'US',
    viewability: 'PARTIAL',
    embeddable: true,
    publicDomain: false,
    textToSpeechPermission: 'ALLOWED',
    epub: {
      isAvailable: true,
      acsTokenLink: 'http://books.google.com/books/download/The_World_of_the_Hunger_Games-sample-epub.acsm?id=Mug4uI3ZGo8C&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api'
    },
    pdf: {
      isAvailable: true,
      acsTokenLink: 'http://books.google.com/books/download/The_World_of_the_Hunger_Games-sample-pdf.acsm?id=Mug4uI3ZGo8C&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api'
    },
    webReaderLink: 'http://play.google.com/books/reader?id=Mug4uI3ZGo8C&hl=&source=gbs_api',
    accessViewStatus: 'SAMPLE',
    quoteSharingAllowed: false
  },
  searchInfo: {
    textSnippet: 'This is the definitive, richly illustrated, full-color guide to all the districts of Panem, all the participants in The Hunger Games, and the life and home of Katniss Everdeen.'
  }
}
*/
type Book = {
  kind: string;
  id: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    pageCount: number;
    printType: string;
    categories: string[];
    averageRating: 3;
    ratingsCount: 9;
    imageLinks: {
      thumbnail: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
  };
};

async function getBooks(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<{ totalItems: number; books: Book[] }> {
  const apiKey = "AIzaSyA7vhetq2aHQOr2kV3aHUylD_4-rWGfD2A";
  const requestBody = { ...searchParams, key: apiKey, maxResults: "40" };
  const queryParams = new URLSearchParams(requestBody).toString();

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${queryParams}`
  );
  const data = await response.json();
  return { totalItems: data.totalItems, books: data.items };
}

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const searchQuery = searchParams.q;
  const { totalItems, books } = await getBooks(searchParams);

  return (
    <main className="flex min-h-screen flex-col items-start justify-start p-24">
      <h2>Results for &quot;{searchQuery}&quot;</h2>
      <p>{totalItems}</p>
      <div className="grid grid-cols-5 gap-8">
        {books.map((book) => {
          return (
            <>
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <Image
                  key={book.id}
                  alt="book cover"
                  src={book.volumeInfo.imageLinks.thumbnail}
                  height={100}
                  width={200}
                />
              ) : (
                <p>{book.volumeInfo.title}</p>
              )}
            </>
          );
        })}
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
