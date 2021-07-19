import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("ツイート投稿フォームの挙動", () => {
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
      .reply(200,
        {
          home_data: [
            {
              id: 1,
              content: "とりあえず生",
              user_id: 1,
              name: "通りすがりのビール好き",
              hashname: [{
                hashname: "ビール"
              }, {
                hashname: "ハートランド"
              }]
            }]
        });

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    })
  };

  it("各要素が正常に表示されている", async () => {
    renderLoginSituation();
    const tweetFormLink = await screen.findByText("ツイート");
    act(() => { userEvent.click(tweetFormLink) });

    expect(await screen.findByPlaceholderText("何かつぶやいてみましょう")).toBeInTheDocument();
    expect(await screen.findByPlaceholderText("ハッシュタグ")).toBeInTheDocument();
    expect(await screen.findByText("追加")).toBeInTheDocument();
    //* ファイル投稿フォームは拾えないため省略 *//
    expect(await screen.findByText("投稿")).toBeInTheDocument();
  });

  it("contentが空のまま投稿するとエラーメッセージが表示される", async () => {
    renderLoginSituation();
    const tweetFormLink = await screen.findByText("ツイート");
    act(() => { userEvent.click(tweetFormLink) });

    const target = await screen.findByText("投稿");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("ツイートの中身が空のままです")).toBeInTheDocument();
  });

  it("ツイート投稿に成功するとホーム画面に遷移する", async () => {

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
      .reply(200,
        {
          home_data: [
            {
              id: 1,
              content: "とりあえず生",
              user_id: 1,
              name: "通りすがりのビール好き",
              hashname: [{
                hashname: "ビール"
              }, {
                hashname: "ハートランド"
              }]
            }]
        });
    // ツイート投稿ボタンのレスポンス用 renderLoginState()の外から付け足し不可
    mock.onPost("http://localhost:3000/tweets").reply(200);

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    })

    const tweetFormLink = await screen.findByText("ツイート");

    act(() => { userEvent.click(tweetFormLink) });

    const inputForm = await screen.findByPlaceholderText("何かつぶやいてみましょう");
    const submitButton = await screen.findByText("投稿");
    act(() => {
      userEvent.type(inputForm, "適当な内容");
      userEvent.click(submitButton);
    });

    expect(await screen.findByText("とりあえず生")).toBeInTheDocument();
  });
});
