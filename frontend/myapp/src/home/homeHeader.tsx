import { useContext, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link as RouterLink, useHistory } from 'react-router-dom';
import axios from 'axios';

import { Button, Container, Drawer, Grid, Link, List, ListItem, makeStyles } from '@material-ui/core';
import DehazeIcon from '@material-ui/icons/Dehaze';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, MessageContext, LoginStateContext, DrawerContext } from "App";
import { AlertSeverityType } from "types/typeList";

import AlertMessage from 'common/alertMessage';
import HomeContent from './homeContent';
import MyPage from 'user/myPage';
import UpdateUserSettings from 'user/updateUserSettings';
import TweetForm from 'tweet/tweetForm';
import UserRelationship from 'user/followings';
import MyFavorite from 'favorite/myFavorite';
import HotTweet from 'tweet/hotTweet';
import HashtagIndex from 'hashtag/hashtagIndex';
import HashtagDetail from 'hashtag/hashtagDetail';
import SearchForm from 'search/searchForm';

import SearchResult from 'search/searchResult';

import { useCheckMobile } from 'common/useCheckMobile';


const HomeHeader = () => {
  const { setLoginState } = useContext(LoginStateContext);
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { drawerDisplay, setDrawerDisplay } = useContext(DrawerContext);
  const history = useHistory();

  const useStyles = makeStyles({
    header: {
      backdropFilter: "blur(20px)",
      padding: "0 15px",
      position: "fixed",
      top: 0,
      zIndex: 10
    },
    exception: {
      fontSize: "20px",
      textAlign: "center",
    },
    mobilePhrase: {
      fontSize: "10px",
      margin: "0",
      width: "fit-content"
    }
  });
  const classes = useStyles();

  const isMobile = useCheckMobile();

  const AppTitle = () => {
    if (isMobile) {
      return <h3>Insyutagram</h3>
    } else {
      return <h2>Insyutagram</h2>
    }
  };

  const MyPageLink = () => {
    if (isMobile) {
      return (
        <>
          <Grid item>
            <PersonIcon />
          </Grid>
          <Grid item>
            <p className={classes.mobilePhrase}>マイページ</p>
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item>
          <p>マイページ</p>
        </Grid>
      );
    }
  };

  const PostLink = () => {
    if (isMobile) {
      return (
        <>
          <Grid item>
            <CreateIcon />
          </Grid>
          <Grid item>
            <p className={classes.mobilePhrase}>ポスト</p>
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item>
          <p>ポスト</p>
        </Grid>
      );
    }
  };

  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const makeAlert = (alertSeverity: AlertSeverityType, message: string[]) => {
    setAlertDisplay(true);
    setAlertSeverity(alertSeverity);
    setMessage(message);
  };
  const resetAlert = () => {
    setAlertDisplay(false);
    setMessage([]);
  };

  const clickLogout = () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/logout`;
    const config = { withCredentials: true };
    axios.delete(url, config).then(async (res) => {
      if (res.data.logged_out === true) {
        await setCurrentUser({});
        await setLoginState(false);
        makeAlert("success", ["ログアウトが完了しました"]);
        history.push("/");
      } else {
        makeAlert("warning", res.data.message)
      }
    }).catch(error => console.log("error :", error));
  }

  const clickDrawer = () => {
    setDrawerDisplay(!drawerDisplay);
  };

  return (
    <div className="header-banner">
      <Grid alignItems="center" className={classes.header} container
        direction="row" justifyContent="space-between">
        <Grid item>
          <Grid alignItems="center" container
            direction="row" justifyContent="flex-start" spacing={1} wrap="nowrap" style={{ margin: '0px' }}>
            <Grid item>
              <Link color="inherit" component={RouterLink} onClick={resetAlert} to="/" underline="none">
                <AppTitle />
              </Link>
            </Grid>
            <Grid item>
              <Link color="inherit" component={RouterLink} onClick={resetAlert} to={`/user/${currentUser.id}`}>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <MyPageLink />
                </Grid>
              </Link>
            </Grid>
            <Grid item>
              <Link color="inherit" component={RouterLink} onClick={resetAlert} to="/tweet">
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <PostLink />
                </Grid>
              </Link>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid alignItems="center" container
            direction="row" justifyContent="flex-end" spacing={1}>
            {!isMobile &&
              <Grid item>
                <SearchForm />
              </Grid>
            }
            <Grid item>
              <Button onClick={clickDrawer} data-testid="dehaze-icon">
                <DehazeIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={drawerDisplay} onClose={clickDrawer}>
        {isMobile &&
          <List>
            <ListItem>
              <SearchForm />
            </ListItem>
          </List>
        }
        <List onClick={clickDrawer}>
          <ListItem button divider>
            <Link color="inherit" component={RouterLink}
              onClick={resetAlert} to={`/user/${currentUser.id}/favorite`} underline="none"
            >
              マイいいね
            </Link>
          </ListItem>
          <ListItem button divider>
            <Link color="inherit" component={RouterLink}
              onClick={resetAlert} to={`/posts`} underline="none"
            >
              最新ポスト一覧
            </Link>
          </ListItem>
          <ListItem button divider>
            <Link color="inherit" component={RouterLink}
              onClick={resetAlert} to={`/hashtag/index`} underline="none"
            >
              タグ一覧
            </Link>
          </ListItem>
          <ListItem button divider>
            <Link color="inherit" component={RouterLink}
              onClick={resetAlert} to="/user/edit/account" underline="none"
            >
              アカウント設定
            </Link>
          </ListItem>
          <ListItem button divider>
            <Link color="inherit" onClick={() => clickLogout()} underline="none">
              ログアウト
            </Link>
          </ListItem>
        </List>
      </Drawer>

      <Container>
        <AlertMessage />
        <Switch>
          <Route path="/" exact component={HomeContent} />
          <Route path="/user/:myPageId" exact component={MyPage} />
          <Route path="/tweet" exact component={TweetForm} />
          <Route path="/user/:userId/favorite" exact component={MyFavorite} />
          <Route path="/posts" exact component={HotTweet} />
          <Route path="/hashtag/index" exact component={HashtagIndex} />
          <Route path="/user/edit/account" exact component={UpdateUserSettings} />

          <Route path="/user/:myPageId/followings" exact component={UserRelationship} />
          <Route path="/user/:myPageId/followers" exact component={UserRelationship} />

          <Route path="/search/:searchWord" exact component={SearchResult} />

          <Route path="/hashtag/:hashname" exact component={HashtagDetail} />
          <Route>
            <h3 className={classes.exception}>
              そのページはご利用いただけません。他のページを探してみましょう。
            </h3>
          </Route>
        </Switch>

      </Container>
    </div>
  );
}

export default HomeHeader;
