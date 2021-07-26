import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, useParams } from "react-router";

import { Pagination } from '@material-ui/lab';

import { HashtagType, BarInfoType, TimelineType, RecipeType } from "types/typeList";

import EditRecipe from "./editRecipe";
import EditMap from "./editMap";
import HashtagDetailContent from "./hashtagDetailContent";

import Timeline from "tweet/timeline";


export const TagDataContext = createContext({} as {
  tagData: Partial<HashtagType>,
  setTagData: any
});

export const RecipeContext = createContext({} as {
  recipe: Partial<RecipeType[]>,
  setRecipe: any
});

export const BarInfoContext = createContext({} as {
  barInfo: Partial<BarInfoType>,
  setBarInfo: any
});

const HashtagDetail = () => {
  console.log("!!HashtagDetail!!");
  const hashname = Object.values(useParams());
  const [tagData, setTagData] = useState<Partial<HashtagType>>({});
  const [timelineData, setTimelineData] = useState<Partial<TimelineType[]>>([]);
  const [recipe, setRecipe] = useState<Partial<RecipeType[]>>([]);
  const [barInfo, setBarInfo] = useState<Partial<BarInfoType>>({});
  const [page, setPage] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const resetData = () => {
    setTimelineData([]);
    setRecipe([]);
    setBarInfo({});
  };

  const getDetailData = () => {
    console.log("!!getDetailData!!");
    resetData();
    const url = `http://localhost:3000/hashtag/${hashname}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      console.log(res);
      setTagData(res.data.hashtag);
      res.data.tweets.forEach((e: TimelineType) => setTimelineData(timelineData => [...timelineData, e]));
      res.data.recipes.forEach((e: RecipeType) => setRecipe(recipe => [...recipe, e]));
      if (res.data.bar_info[0]) { setBarInfo(res.data.bar_info[0]) };
      const number = Math.ceil(res.data.tweets_count / 15);
      setPageNumber(number);
    });
  };

  useEffect(getDetailData, []);

  const handlePagination = (p: number) => {
    setPage(p);
    setTimelineData([]);
    const url = `http://localhost:3000/hashtag/${hashname}?page=${p}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(response => {
      response.data.tweets.forEach((e: TimelineType) => setTimelineData(timelineData => [...timelineData, e]));
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  const MyPagination = () => {
    return (
      <Pagination color="primary"
        count={pageNumber}
        onChange={(e, p) => handlePagination(p)}
        page={page}
        variant="outlined"
        shape="rounded" />
    );
  }

  return (
    <TagDataContext.Provider value={{ tagData, setTagData }}>
      <RecipeContext.Provider value={{ recipe, setRecipe }}>
        <BarInfoContext.Provider value={{ barInfo, setBarInfo }}>
          <div>
            <Router>
              <Route path="/hashtag/:hashname" exact component={HashtagDetailContent} />
              <Route path="/hashtag/:hashname/edit/recipe" exact component={EditRecipe} />
              <Route path="/hashtag/:hashname/edit/map" exact component={EditMap} />
            </Router>

            <Timeline data={timelineData} />
            <MyPagination />
          </div>
        </BarInfoContext.Provider>
      </RecipeContext.Provider>
    </TagDataContext.Provider>
  );
};

export default HashtagDetail;
