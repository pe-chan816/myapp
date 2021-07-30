import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState<string>("");
  const history = useHistory();

  const keyDownSearchForm = (e: any) => {
    if (e.keyCode === 13) {
      history.push(`/search/${searchWord}`);
    }
  };

  const clickSearchIcon = () => {
    history.push(`/search/${searchWord}`);
  };

  const clickDeleteWord = () => {
    setSearchWord("");
  }

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon data-testid="SearchIcon" onClick={clickSearchIcon} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <CloseIcon fontSize="small" onClick={clickDeleteWord} />
          </InputAdornment>
        )
      }}
      onChange={(e) => setSearchWord(e.target.value)} onKeyDown={keyDownSearchForm}
      placeholder="検索" value={searchWord} variant="standard"
    />
  );
};

export default SearchForm;
