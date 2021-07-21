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
  //HomeContent用
  mock.onGet("http://localhost:3000")
    .reply(200, { home_data: [{}] });
  //検索結果表示用
  mock.onGet("http://localhost:3000/search/ジントニック")
    .reply(200, {
      searched_tweet: [
        {
          id: 1,
          content: "とりあえずジントニック",
          user_id: 1,
          name: "スノッブ",
          hashname: [{
            hashname: "ジントニック"
          }, {
            hashname: "タンカレー"
          }]
        }
      ],
      searched_user: [
        {
          id: 10,
          name: "通りすがりのジントニック好き",
        }
      ]
    });


  act(() => {
    render(
      <Router history={history}>
        <App />
      </Router>
    );
  })

  const searchLink = await screen.findByRole("link", { name: "キーワード検索" });
  act(() => { userEvent.click(searchLink) });
};

describe("検索ページのテスト", () => {
  it("Formの各要素が正常に表示されている", async () => {
    await renderLoginSituation();

    expect(await screen.findByPlaceholderText("検索したいキーワード"));
    expect(await screen.findByRole("button", { name: "検索" }));
  });

  it("inputの表示内容が正常に更新される", async () => {
    await renderLoginSituation();
    const target = screen.getByRole("textbox");
    act(() => { userEvent.type(target, "ジントニック") });

    expect(await screen.findByDisplayValue("ジントニック")).toBeInTheDocument();
  });
});

describe("検索機能のテスト", () => {
  it("検索結果が正常に表示される", async () => {
    await renderLoginSituation();
    const textBox = screen.getByRole("textbox");
    const searchButton = screen.getByRole("link", { name: "検索" });
    await act(async () => { userEvent.type(textBox, "ジントニック"); });
    await act(async () => { userEvent.click(searchButton) });

    expect(await screen.findByText('" ジントニック " の検索結果')).toBeInTheDocument();
    expect(screen.getByText("↓ツイート↓")).toBeInTheDocument();
    expect(screen.getByText("とりあえずジントニック")).toBeInTheDocument();
    expect(screen.getByText("スノッブ")).toBeInTheDocument();
    expect(screen.getByText("#ジントニック")).toBeInTheDocument();
    expect(screen.getByText("#タンカレー")).toBeInTheDocument();
    expect(screen.getByText("↓ユーザー↓")).toBeInTheDocument();
    expect(screen.getByText("通りすがりのジントニック好き")).toBeInTheDocument();
  });
});
