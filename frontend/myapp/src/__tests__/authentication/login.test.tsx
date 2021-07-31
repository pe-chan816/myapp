import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

const renderDOM = async () => {
  const history = createMemoryHistory();
  const mock = new MockAdapter(axios);
  //ログインボタンを押したとき
  mock.onPost("http://localhost:3000/login")
    .reply(200, {
      logged_in: true,
      user: {
        id: 1,
        name: "somebody"
      }
    });
  //HomeContent用
  mock.onGet("http://localhost:3000")
    .reply(200,
      {
        home_data: [{
          id: 2,
          content: "ノンアルコールでお願いします",
          user_id: 2,
          name: "Mr.下戸",
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

  const loginLink = await screen.findByRole("link", { name: "ログイン" });
  act(() => { userEvent.click(loginLink) });
};

describe("ログインフォーム", () => {
  it("各要素が正しく表示されている", async () => {
    renderDOM();
    expect(await screen.findByText("アカウントログイン")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });
});

describe("ログイン成功時の挙動", () => {
  const renderLogin = async () => {
    await renderDOM();

    const emailForm = await screen.findByPlaceholderText("メールアドレス");
    const passwordForm = screen.getByPlaceholderText("パスワード");
    const loginButton = screen.getByRole("button", { name: "ログイン" });
    act(() => {
      userEvent.type(emailForm, "email@email.com");
      userEvent.type(passwordForm, "password");
      userEvent.click(loginButton);
    });

    await screen.findByText("マイページ");
  };

  it("ログイン状態になりHomeHeaderが切り替わる", async () => {
    await renderLogin();
    expect(await screen.findByText("ノンアルコールでお願いします")).toBeInTheDocument();
  });

  it("メッセージが表示される", async () => {
    await renderLogin();
    expect(await screen.findByText("おかえりなさいませ")).toBeInTheDocument();
  });
});

describe("ログイン失敗時の挙動", () => {
  const failLogin = async () => {
    await renderDOM();
    const emailForm = await screen.findByPlaceholderText("メールアドレス");
    const passwordForm = screen.getByPlaceholderText("パスワード");
    const button = screen.getByRole("button", { name: "ログイン" });
    const mock = new MockAdapter(axios);
    mock.onPost("http://localhost:3000/login")
      .reply(200, { errors: ["ログイン失敗"] });

    act(() => {
      userEvent.type(emailForm, "email@email.com");
      userEvent.type(passwordForm, "wrong_password");
      userEvent.click(button);
    });
  };

  it("エラーメッセージが表示される", async () => {
    failLogin();

    expect(await screen.findByText("ログイン失敗")).toBeInTheDocument();
  });

  it("passwordのvalueがクリアされる", async () => {
    failLogin();

    await screen.findByText("ログイン失敗")
    expect(screen.queryByDisplayValue("wrong_password")).not.toBeInTheDocument();
  });
});
