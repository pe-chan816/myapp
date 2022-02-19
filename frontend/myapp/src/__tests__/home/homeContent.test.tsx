import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("ホーム画面", () => {
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
      .reply(200, {
        home_data: [
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
    // hashtagDetailContent用
    mock.onGet(`http://localhost:3000/hashtag/ビール`)
      .reply(200, {
        hashtag: { hashname: "ビール" },
        tweets: [],
        recipes: [],
        bar_info: [],
      });

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    })
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

  it("タイムラインが正しく表示される", async () => {
    renderLoginSituation();
    await assertExisting();
  });

  it("更新ボタンを押すとタイムラインが表示されなおす", async () => {
    renderLoginSituation();
    const target = await screen.findByText("更新");
    act(() => { userEvent.click(target) });
    await assertExisting();
  });

  it("削除ボタンを押すと確認ダイアログが表示される", async () => {
    renderLoginSituation();
    const deleteIcon = await screen.findByTestId("DeleteIcon");
    act(() => { userEvent.click(deleteIcon) });

    expect(await screen.findByText("本当にこのポストを削除しますか？")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("ハッシュタグのリンクからその詳細ページへ飛べる", async () => {
    renderLoginSituation();
    const target = await screen.findByText("#ビール");
    act(() => { userEvent.click(target) });
    expect(await screen.findByText("#ビール")).toBeInTheDocument();
    expect(screen.getByTestId("SettingsIcon")).toBeInTheDocument();
  });
});
