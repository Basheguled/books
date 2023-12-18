const Spyglass = () => (
  <svg
    aria-hidden="true"
    className="h-9 w-9 absolute top-2 left-2"
    viewBox="0 0 24 24"
  >
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const SearchBar = ({ setSearch }: { setSearch: (search: string) => void }) => (
  <div className="flex flex-row items-center justify-start w-full gap-4">
    <div className="h-12 w-[561px] relative">
      <Spyglass />
      <input
        aria-label="Search for a book or author"
        className="h-full w-full pl-12 border-2 border-solid border-black rounded focus:outline-none"
        inputMode="search"
        placeholder="Search for a book or author..."
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearch(event.target.value);
        }}
        type="search"
      />
    </div>
    <button
      className="p-3 hover:text-white hover:bg-black focus:text-white focus:bg-black text-black border-black border-solid border-2 rounded"
      type="submit"
    >
      Search
    </button>
  </div>
);

export default SearchBar;
