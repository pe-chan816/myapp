import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

const renderLoginSituation = async () => {
  const history = createMemoryHistory();
  const mock = new MockAdapter(axios);
  // AppのcheckLoginStatusでのログインチェック
  mock.onGet("http://localhost:3000/check_login")
    .reply(200, {
      logged_in: true,
      user: { id: 1 }
    });
  // hashtagIndex表示用
  mock.onGet("http://localhost:3000/hashtags")
    .reply(200, {
      hashtags: [
        {
          hashname: "ジントニック",
          count: 5
        },
      ]
    });
  // hashtagDetail関連表示用
  mock.onGet("http://localhost:3000/hashtag/ジントニック")
    .reply(200, {
      hashtag: { hashname: "ジントニック" },
      tweets: [{
        id: 1,
        content: "とりあえずジントニック",
        user_id: 1,
        name: "スノッブ",
        hashname: [{
          hashname: "ジントニック"
        }, {
          hashname: "タンカレー"
        }]
      }],
      recipes: [
        {
          material: "ジン",
          amount: 45,
          unit: "ml"
        },
        {
          material: "トニックウォーター",
          unit: "適量"
        }
      ],
      bar_info: []
    });

  act(() => {
    render(
      <Router history={history}>
        <App />
      </Router>
    );
  });

  const tagIndexLink = await screen.findByText("タグ一覧");
  act(() => { userEvent.click(tagIndexLink) });

  const beerTagLink = await screen.findByText("ジントニック(5)");
  act(() => { userEvent.click(beerTagLink) });
};

describe("ハッシュタグ詳細ページの挙動", () => {
  it("各要素が正常に表示されている", async () => {
    renderLoginSituation();
    const tagEditButton = await screen.findByRole("button", { name: "タグ編集" })

    //linkになっている#ジントニックとtextが被るため確認できない おそらくtest-idを使えばいける
    //expect(await screen.findAllByText("#ビール")).toBeInTheDocument();
    expect(await screen.findByText("ジン : 45 ml")).toBeInTheDocument();
    expect(await screen.findByText("トニックウォーター : 適量")).toBeInTheDocument();
    expect(tagEditButton).toBeInTheDocument();
    expect(await screen.findByText("とりあえずジントニック")).toBeInTheDocument();
    expect(await screen.findByText("スノッブ")).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "#ジントニック" })).toBeInTheDocument();
    expect(await screen.findByRole("link", { name: "#タンカレー" })).toBeInTheDocument();

    act(() => { userEvent.click(tagEditButton) });
    expect(await screen.findByText(/カクテルについてのものなら/)).toBeInTheDocument();
    expect(await screen.findByText(/BARについてのものなら/)).toBeInTheDocument();

    const cocktailRadio = screen.getByRole("radio", { name: "カクテル" });
    const barInfoRadio = screen.getByRole("radio", { name: "BAR" });
    act(() => { userEvent.click(cocktailRadio) });
    expect(await screen.findByRole("link", { name: "レシピ編集" }));
    act(() => { userEvent.click(barInfoRadio) });
    expect(await screen.findByRole("link", { name: "マップ編集" }));
  });
});
