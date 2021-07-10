import { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchForm = () => {
  const [searchWord, setSearchWord] = useState<string>("");

  return (
    <div>
      <div>
        <input
          type="text"
          name="search"
          placeholder="検索したいキーワード"
          onChange={(e) => { setSearchWord(e.target.value) }} />
        <Link to={`/search/${searchWord}`}><button>検索</button></Link>
      </div>
    </div>
  );
};

export default SearchForm;
