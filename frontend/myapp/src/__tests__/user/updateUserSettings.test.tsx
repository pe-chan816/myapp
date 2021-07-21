import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("アカウント設定ページの挙動", () => {
  const renderLoginSituation = async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    // AppのcheckLoginStatusでのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: {
          id: 1,
          name: "テストユーザー",
          email: "email@email.com"
        }
      });
    //HomeContent用
    mock.onGet("http://localhost:3000")
      .reply(200, { home_data: [{}] });
    // アカウント設定変更用
    mock.onPatch("http://localhost:3000/users/1")
      .reply(200, {
        user: {
          id: 1,
          name: "テストユーザー改",
          email: "another@email.com"
        }
      });
    mock.onDelete("http://localhost:3000/users/1").reply(200);

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    })

    const settingLink = await screen.findByRole("link", { name: "アカウント設定" });
    act(() => { userEvent.click(settingLink) });
  };

  it("各要素が正常に表示されている", async () => {
    await renderLoginSituation();

    expect(screen.getByText("ユーザーアカウント設定")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "名前 :" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("テストユーザー")).toBeInTheDocument();
    expect(screen.getByText("プロフィール画像 :")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email :" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email@email.com")).toBeInTheDocument();
    expect(screen.getByText("パスワード :")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("新しいパスワード")).toBeInTheDocument();
    expect(screen.getByText("パスワード確認 :")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワードをもう一度入力してください")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "アカウント削除" })).toBeInTheDocument();
  });

  it("編集に成功するとプレースホルダが切り替わる", async () => {
    await renderLoginSituation();
    const nameInputArea = screen.getByRole("textbox", { name: "名前 :" });
    const emailInputArea = screen.getByRole("textbox", { name: "Email :" });
    const editButton = screen.getByRole("button", { name: "編集" });

    await act(async () => {
      userEvent.type(nameInputArea, "テストユーザー改");
      userEvent.type(emailInputArea, "another@email.com");
    });
    act(() => { userEvent.click(editButton) });

    expect(await screen.findByPlaceholderText("テストユーザー改"));
    expect(screen.getByPlaceholderText("another@email.com"));
  });

  // window.confirm が未実装のためアカウント削除時の挙動は現時点ではテスト不可 //
});
