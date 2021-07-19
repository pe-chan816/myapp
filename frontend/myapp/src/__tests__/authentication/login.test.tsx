import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";
import Login from "login/login";

afterEach(cleanup);

const renderDOM = () => {
  render(
    <Login />
  );
};

describe("ログインフォーム", () => {
  it("各要素が正しく表示されている", () => {
    renderDOM();
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.getByText("!!ログイン!!")).toBeInTheDocument();
  });
});

describe("ログイン成功時の挙動", () => {
  it("ログイン状態になりHomeHeaderが切り替わる", async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    //ログインボタンを押したとき
    mock.onPost("http://localhost:3000/login")
      .reply(200, { logged_in: true });
    //"checkLoginStatus"from"App"でのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      })
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

    userEvent.click(screen.getByRole("link", { name: "ログイン" })) //ログイン画面に移動

    const emailForm = screen.getByRole("textbox", { name: "Email:" });
    const passwordForm = screen.getByPlaceholderText("パスワード");
    const button = screen.getByRole("button", { name: "!!ログイン!!" });
    act(() => {
      userEvent.type(emailForm, "email@email.com");
      userEvent.type(passwordForm, "password");
      userEvent.click(button);
    });

    expect(await screen.findByText("ノンアルコールでお願いします")).toBeInTheDocument();
  });
});

describe("ログイン失敗時の挙動", () => {
  const failLogin = () => {
    const emailForm = screen.getByRole("textbox", { name: "Email:" });
    const passwordForm = screen.getByPlaceholderText("パスワード");
    const button = screen.getByRole("button", { name: "!!ログイン!!" });
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
    act(() => {
      renderDOM();
    });
    failLogin();
    expect(await screen.findByText("ログイン失敗")).toBeInTheDocument();
  });

  it("passwordのvalueがクリアされplaceholderが表示される", async () => {
    act(() => {
      renderDOM();
    });
    failLogin();
    expect(await screen.findByPlaceholderText("パスワード")).toBeInTheDocument();
  });
});
