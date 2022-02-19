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
          id: 1,
          material: "ジン",
          amount: 45,
          unit: "ml",
          position: 1
        },
        {
          id: 2,
          material: "トニックウォーター",
          unit: "適量",
          position: 2
        }
      ],
      bar_info: []
    });
  mock.onDelete("http://localhost:3000/hashtag/delete/recipe/1")
    .reply(200, {
      new_recipe: [{
        id: 2,
        material: "トニックウォーター",
        unit: "適量"
      }]
    });
  mock.onPost("http://localhost:3000/hashtag/ジントニック/edit/recipe")
    .reply(200, {
      recipes: [
        {
          id: 1,
          material: "ジン",
          amount: 45,
          unit: "ml",
          position: 1
        },
        {
          id: 2,
          material: "トニックウォーター",
          unit: "適量",
          position: 2
        },
        {
          id: 3,
          material: "ライムジュース",
          amount: 15,
          unit: "ml",
          position: 3
        }
      ]
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
  act(async () => { userEvent.click(dehazeIcon) });

  const tagIndexLink = await screen.findByText("タグ一覧");
  act(() => { userEvent.click(tagIndexLink) });

  const TagLink = await screen.findByText("ジントニック(5)");
  act(() => { userEvent.click(TagLink) });

  const tagEditButton = await screen.findByTestId("SettingsIcon");
  act(() => { userEvent.click(tagEditButton) });

  const cocktailRadio = await screen.findByRole("radio", { name: "カクテル" });
  act(() => { userEvent.click(cocktailRadio) });

  const editRecipeLink = await screen.findByRole("link", { name: "レシピ編集" });
  act(() => { userEvent.click(editRecipeLink) });

};

describe("レシピ編集ページの挙動", () => {

  it("各要素が正常に表示されている", async () => {
    await renderLoginSituation();

    expect(await screen.findByRole("link", { name: "#ジントニック" })).toBeInTheDocument();
    expect(screen.getByText("ジン : 45 ml")).toBeInTheDocument();
    expect(screen.getByTestId("CloseIcon0")).toBeInTheDocument();
    expect(screen.getByText("トニックウォーター : 適量")).toBeInTheDocument();
    expect(screen.getByTestId("CloseIcon1")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("ジン, ウォッカ etc...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("45 etc...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "単位" })).toBeInTheDocument();

    expect(screen.getByText("とりあえずジントニック")).toBeInTheDocument();
    expect(screen.getByText("スノッブ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "#ジントニック" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "#タンカレー" })).toBeInTheDocument();

  });

  it("単位セレクターをクリックするとリストが表示される", async () => {
    await renderLoginSituation();
    const target = await screen.findByRole("button", { name: "単位" });
    act(() => { userEvent.click(target) });

    expect(await screen.findByRole("option", { name: /---/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "drop" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "dash" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "tsp" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "ml" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "適量" })).toBeInTheDocument();
  });

  it("トップにあるハッシュタグがタグ詳細ページにリンクされている", async () => {
    await renderLoginSituation();
    const target = await screen.findByRole("link", { name: "#ジントニック" });
    await act(async () => { userEvent.click(target) });

    expect(await screen.findByTestId("SettingsIcon")).toBeInTheDocument();
  });

  /*
  it("'x'ボタンを押すとその行のレシピが削除される", async () => {
    await renderLoginSituation();
    expect(await screen.findByText("ジン : 45 ml")).toBeInTheDocument();

    const target = screen.getByTestId("CloseIcon0");
    await act(async () => { userEvent.click(target) });

    expect(screen.getByText("トニックウォーター : 適量")).toBeInTheDocument();
    // なくなったことを検証できない
    expect(screen.queryByText("ジン : 45 ml")).not.toBeInTheDocument();
  });
  */

  it("レシピの追加を正常に行うことができる", async () => {
    await renderLoginSituation();
    const materialInput = await screen.findByPlaceholderText("ジン, ウォッカ etc...");
    const amountInput = screen.getByPlaceholderText("45 etc...");
    const unitInput = await screen.findByRole("button", { name: "単位" });

    act(async () => {
      userEvent.type(materialInput, "ライムジュース");
      userEvent.type(amountInput, "15");
      userEvent.click(unitInput);
      const somethingUnit = await screen.findByRole("option", { name: "ml" });
      userEvent.click(somethingUnit);
      const addButton = await screen.findByRole("button", { name: "追加" });
      userEvent.click(addButton)
    });

    expect(await screen.findByText("ライムジュース : 15 ml")).toBeInTheDocument();
    expect(screen.getByText("ジン : 45 ml")).toBeInTheDocument();
    expect(screen.getByText("トニックウォーター : 適量")).toBeInTheDocument();
  });

});
