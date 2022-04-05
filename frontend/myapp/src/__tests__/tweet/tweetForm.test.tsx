import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";
import { jestMockMatchMedia } from 'test-utilities/jestMockMatchMedia';

afterEach(cleanup);
beforeEach(() => {
  jestMockMatchMedia({
    media: '',
    matches: false
  });
});

describe("ツイート投稿フォームの挙動", () => {
  const renderLoginSituation = async () => {
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

    const tweetFormLink = await screen.findByText("ポスト");
    act(() => { userEvent.click(tweetFormLink) });
  };

  it("各要素が正常に表示されている", async () => {
    await renderLoginSituation();

    expect(await screen.findByPlaceholderText("何かつぶやいてみましょう")).toBeInTheDocument();
    expect(screen.getByTestId("ImageIcon")).toBeInTheDocument();
    expect(screen.getByTestId("LabelIcon")).toBeInTheDocument();
    expect(screen.getByTestId("SendIcon")).toBeInTheDocument();
  });

  it("ハッシュタグアイコンをクリックすると入力フォームが表示される", async () => {
    await renderLoginSituation();
    const tagIcon = await screen.findByTestId("LabelIcon");
    act(() => { userEvent.click(tagIcon) });

    expect(await screen.findByPlaceholderText("# は不要です"));
    expect(screen.getByTestId("disAddIcon")).toBeInTheDocument();
  });

  it("ハッシュタグの入力をすると結果が表示される", async () => {
    await renderLoginSituation();
    const tagIcon = await screen.findByTestId("LabelIcon");
    act(() => { userEvent.click(tagIcon) });

    const inputForm = await screen.findByPlaceholderText("# は不要です");
    act(() => { userEvent.type(inputForm, "test") });

    const addButton = await screen.findByTestId("AddIcon");
    act(() => { userEvent.click(addButton) });

    expect(await screen.findByTestId("CloseIcon")).toBeInTheDocument();
  });

  it("contentが空のまま投稿するとエラーメッセージが表示される", async () => {
    await renderLoginSituation();
    const target = await screen.findByTestId("SendIcon");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("ポスト内容が空のままです")).toBeInTheDocument();
  });

  it("ツイート投稿に成功するとホーム画面に遷移しフラッシュメッセージが表示される", async () => {
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

    const tweetFormLink = await screen.findByText("ポスト");
    act(() => { userEvent.click(tweetFormLink) });

    const inputForm = await screen.findByPlaceholderText("何かつぶやいてみましょう");
    const submitButton = screen.getByTestId("SendIcon");
    act(() => {
      userEvent.type(inputForm, "適当な内容");
      userEvent.click(submitButton);
    });

    expect(await screen.findByText("とりあえず生")).toBeInTheDocument();
    expect(screen.getByText("ポスト投稿完了！")).toBeInTheDocument();
  });
});
