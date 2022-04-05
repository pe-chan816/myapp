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

  await screen.findAllByText("マイページ");
  const dehazeIcon = screen.getByTestId("dehaze-icon");
  act(() => { userEvent.click(dehazeIcon) });

  const tagIndexLink = await screen.findByText("タグ一覧");
  act(() => { userEvent.click(tagIndexLink) });

  const beerTagLink = await screen.findByText("ジントニック(5)");
  act(() => { userEvent.click(beerTagLink) });
};

describe("ハッシュタグ詳細ページの挙動", () => {
  it("各要素が正常に表示されている", async () => {
    await renderLoginSituation();

    expect(await screen.findByText("ジン : 45 ml")).toBeInTheDocument();
    expect(screen.getByText("トニックウォーター : 適量")).toBeInTheDocument();
    expect(screen.getByTestId("SettingsIcon")).toBeInTheDocument();
    expect(screen.getByText("とりあえずジントニック")).toBeInTheDocument();
    expect(screen.getByText("スノッブ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "#ジントニック" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "#タンカレー" })).toBeInTheDocument();
  });

  it("タグ編集ボタンを押すと表示されるダイアログの内容が正常に表示されている", async () => {
    await renderLoginSituation();
    const tagEditButton = await screen.findByTestId("SettingsIcon")
    act(() => { userEvent.click(tagEditButton) });

    expect(await screen.findByText(/カクテルについてのものなら/)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "カクテル" }));
    expect(screen.getByRole("radio", { name: "BAR" }));
  });

  it("タグ編集ダイアログのラジオボタンを押すとリンクが切り替わる", async () => {
    await renderLoginSituation();
    const tagEditButton = await screen.findByTestId("SettingsIcon")
    act(() => { userEvent.click(tagEditButton) });

    const cocktailRadio = await screen.findByRole("radio", { name: "カクテル" });
    const barInfoRadio = screen.getByRole("radio", { name: "BAR" });

    act(() => { userEvent.click(cocktailRadio) });
    expect(await screen.findByRole("link", { name: "レシピ編集" }));

    act(() => { userEvent.click(barInfoRadio) });
    expect(await screen.findByRole("link", { name: "マップ編集" }));
  });
});
