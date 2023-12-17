import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setSearch }: { setSearch: (search: string) => void }) => (
  <div className="flex flex-row items-center justify-center w-full gap-4">
    <TextField
      autoFocus
      id="search-bar"
      className="w-full"
      label="What book are you looking for?"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
      }}
      size="small"
      variant="outlined"
    />
    <IconButton color="info" type="submit">
      <SearchIcon fontSize="large" />
    </IconButton>
  </div>
);

export default SearchBar;
