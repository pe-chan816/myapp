import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, useParams } from "react-router";

import { makeStyles } from "@material-ui/core";
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
  const hashname = Object.values(useParams());
  const [tagData, setTagData] = useState<Partial<HashtagType>>({});
  const [timelineData, setTimelineData] = useState<Partial<TimelineType[]>>([]);
  const [recipe, setRecipe] = useState<Partial<RecipeType[]>>([]);
  const [barInfo, setBarInfo] = useState<Partial<BarInfoType>>({});
  const [page, setPage] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const useStyles = makeStyles({
    pagination: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: "600px",
    }
  });
  const classes = useStyles();

  const resetData = () => {
    setTimelineData([]);
    setRecipe([]);
    setBarInfo({});
  };

  const getDetailData = () => {
    resetData();
    const url = `${process.env.REACT_APP_API_DOMAIN}/hashtag/${hashname}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setTagData(res.data.hashtag);
      setTimelineData(res.data.tweets);
      setRecipe(res.data.recipes);
      if (res.data.bar_info[0]) { setBarInfo(res.data.bar_info[0]) };
      const number = Math.ceil(res.data.tweets_count / 15);
      setPageNumber(number);
    });
  };

  useEffect(getDetailData, []);

  const handlePagination = (p: number) => {
    setPage(p);
    setTimelineData([]);
    const url = `${process.env.REACT_APP_API_DOMAIN}/hashtag/${hashname}?page=${p}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setTimelineData(res.data.tweets);
    }).catch(error => {
      console.log("error :", error);
    });
  };

  const MyPagination = () => {
    return (
      <Pagination className={classes.pagination}
        color="primary"
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

            {timelineData.toString() !== [].toString() &&
              <>
                <Timeline data={timelineData} />
                <MyPagination />
              </>}
          </div>
        </BarInfoContext.Provider>
      </RecipeContext.Provider>
    </TagDataContext.Provider>
  );
};

export default HashtagDetail;
