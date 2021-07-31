import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { AlertDisplayContext, MessageContext } from "App";

import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState<string>("");
  const history = useHistory();
  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setMessage } = useContext(MessageContext);
  const resetAlert = () => {
    setAlertDisplay(false);
    setMessage([]);
  };

  const enterSearchForm = () => {
    history.push(`/search/${searchWord}`);
    resetAlert();
  };


  const keyDownSearchForm = (e: any) => {
    if (e.keyCode === 13) {
      enterSearchForm();
    }
  };

  const clickSearchIcon = () => {
    enterSearchForm();
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
