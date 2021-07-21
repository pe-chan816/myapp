import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("ログイン時のホームヘッダー", () => {
  const renderLoginSituation = () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    // AppのcheckLoginStatusでのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      });
    //HomeContent用
    mock.onGet("http://localhost:3000")
      .reply(200, { home_data: [{}] });
    //myPage用
    mock.onGet("http://localhost:3000/users/1")
      .reply(200, {
        user: {
          id: 1,
          name: "somebody1",
        },
        mypage_data: [{}],
        followings: [{}],
        followings_count: 100,
        followers: [{}],
        followers_count: 50
      });
    //myFavorite用
    mock.onGet("http://localhost:3000/users/1/myfavorite")
      .reply(200, { my_favorites: [{}] });
    //hashtagIndex用
    mock.onGet("http://localhost:3000/hashtags")
      .reply(200, { hashtags: [{}] });

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    })
  };

  it("各要素が正しく表示されている", async () => {
    renderLoginSituation();
    expect(await screen.findByText("マイページ")).toBeInTheDocument();
    expect(await screen.findByText("ツイート")).toBeInTheDocument();
    expect(await screen.findByText("マイいいね")).toBeInTheDocument();
    expect(await screen.findByText("タグ一覧")).toBeInTheDocument();
    expect(await screen.findByText("キーワード検索")).toBeInTheDocument();
    expect(await screen.findByText("アカウント設定")).toBeInTheDocument();
  });

  it("'マイページ'のリンクが正常に動作する", async () => {
    renderLoginSituation();
    const target = await screen.findByText("マイページ");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("somebody1"));
    expect(await screen.findByText("100"));
    expect(await screen.findByText("50"));
  });

  it("'ツイート'のリンクが正常に動作する", async () => {
    renderLoginSituation();
    const target = await screen.findByText("ツイート");
    act(() => { userEvent.click(target) });

    expect(await screen.findByPlaceholderText("何かつぶやいてみましょう"));
  });

  it("'マイいいね'のリンクが正常に動作する", async () => {
    renderLoginSituation();
    const target = await screen.findByText("マイいいね");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("いいねしたツイート")).toBeInTheDocument();
  });

  it("'タグ一覧表示'のリンクが正常に動作する", async () => {
    renderLoginSituation();
    const target = await screen.findByText("タグ一覧");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("ハッシュタグ一覧")).toBeInTheDocument();
  });

  it("'検索'のリンクが正常に動作する", async () => {
    renderLoginSituation();
    const target = await screen.findByText("キーワード検索");
    act(() => { userEvent.click(target) });

    expect(await screen.findByPlaceholderText("検索したいキーワード")).toBeInTheDocument();
  });

  it("'アカウント設定'のリンクが正常に動作する", async () => {
    renderLoginSituation();
    const target = await screen.findByText("アカウント設定");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("ユーザーアカウント設定")).toBeInTheDocument();
  });
});
