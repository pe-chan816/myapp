import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, queryByRole, render, screen } from "@testing-library/react";
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

describe("最新ツイート一覧", () => {
  const renderLoginSituation = async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    // AppのcheckLoginStatusでのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      });
    // HotTweet用
    mock.onGet("http://localhost:3000/tweets")
      .reply(200, {
        hot_tweet_data: [
          {
            id: 1,
            content: "とりあえず生",
            user_id: 1,
            name: "通りすがりのビール好き",
            unique_name: "beerholic",
            hashname: [{
              hashname: "ビール"
            }, {
              hashname: "ハートランド"
            }]
          }, {
            id: 2,
            content: "ノンアルコールでお願いします",
            user_id: 2,
            name: "Mr.下戸",
            unique_name: "nondrinker",
            hashname: [{
              hashname: "飲めない"
            }]
          }]
      });

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    });

    await screen.findByText("マイページ");
    const dehazeIcon = screen.getByTestId("dehaze-icon");
    act(() => { userEvent.click(dehazeIcon) });

    const hotTweetLink = await screen.findByText("最新ポスト一覧");
    act(() => { userEvent.click(hotTweetLink) });

    await screen.findByText("最新ポスト");
  };

  const assertExisting = async () => {
    expect(await screen.findByText("通りすがりのビール好き")).toBeInTheDocument();
    expect(screen.getByText("@beerholic")).toBeInTheDocument();
    expect(screen.getByText("とりあえず生")).toBeInTheDocument();
    expect(screen.getByText("#ビール")).toBeInTheDocument();
    expect(screen.getByText("#ハートランド")).toBeInTheDocument();

    expect(screen.getByText("ノンアルコールでお願いします")).toBeInTheDocument();
    expect(screen.getByText("Mr.下戸")).toBeInTheDocument();
    expect(screen.getByText("@nondrinker")).toBeInTheDocument();
    expect(screen.getByText("#飲めない")).toBeInTheDocument();
  };

  it("各要素が正常に表示されている", async () => {
    await renderLoginSituation();

    expect(screen.getByText("最新ポスト")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
    await assertExisting();
  });

  it("次へボタンが表示されていない", async () => {
    await renderLoginSituation();

    expect(screen.queryByRole("button", { name: "次へ" })).not.toBeInTheDocument();
  });

  it("前へボタンが表示されていない", async () => {
    await renderLoginSituation();

    expect(screen.queryByRole("button", { name: "前へ" })).not.toBeInTheDocument();
  });
});
