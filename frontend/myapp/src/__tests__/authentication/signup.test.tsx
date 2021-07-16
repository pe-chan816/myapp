import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";
import Signup from "signup/signup";

afterEach(cleanup);

describe("アカウント登録フォーム", () => {
  it("各要素が正しく表示されている", () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText("ハンドルネーム")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("もう一度パスワードを入力してください")).toBeInTheDocument();
  });
});

describe("アカウント作成成功時の挙動", () => {
  it("ログイン状態になりHomeHeaderが切り替わる", async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    //アカウント作成ボタンを押したとき
    mock.onPost("http://localhost:3000/signup")
      .reply(200, { status: "created" });
    //"checkLoginStatus"from"App"でのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      })
    //HomeContent用
    mock.onGet("http://localhost:3000").reply(200);

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    });

    userEvent.click(screen.getByRole("link", { name: "アカウント登録" })) //アカウント作成画面に移動

    const nameForm = screen.getByRole("textbox", { name: "Name:" });
    const emailForm = screen.getByRole("textbox", { name: "Email:" });
    const passwordForm = screen.getByPlaceholderText("パスワード");
    const passConfForm = screen.getByPlaceholderText("もう一度パスワードを入力してください");
    const button = screen.getByRole("button", { name: "!!アカウント作成!!" });

    act(() => {
      userEvent.type(nameForm, "somebody");
      userEvent.type(emailForm, "email@email.com");
      userEvent.type(passwordForm, "password");
      userEvent.type(passConfForm, "password");
      userEvent.click(button);
    });

    // <Link>を踏むわけではないのでテスト上は空のコンテンツのURLを踏むことになる
    expect(await screen.findByText("そのページはご利用いただけません。他のページを探してみましょう。")).toBeInTheDocument();
  });
});

describe("アカウント作成失敗時の挙動", () => {
  it("エラーメッセージが表示される", async () => {
    act(() => {
      render(<Signup />);
    })
    const button = screen.getByRole("button", { name: "!!アカウント作成!!" });

    const mock = new MockAdapter(axios);
    mock.onPost("http://localhost:3000/signup")
      .reply(200, { messages: ["some error message"] });

    act(() => { userEvent.click(button) });
    expect(await screen.findByText("some error message")).toBeInTheDocument();
  });

  it("パスワードの入力がクリアされる", async () => {
    act(() => {
      render(<Signup />);
    })
    const passwordForm = screen.getByPlaceholderText("パスワード");
    const passConfForm = screen.getByPlaceholderText("もう一度パスワードを入力してください");
    const button = screen.getByRole("button", { name: "!!アカウント作成!!" });

    const mock = new MockAdapter(axios);
    mock.onPost("http://localhost:3000/signup")
      .reply(200, { messages: ["some error message"] });

    act(() => {
      userEvent.type(passwordForm, "wrong_password");
      userEvent.type(passConfForm, "very_wrong_password");
      userEvent.click(button)
    });

    expect(await screen.findByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(await screen.findByPlaceholderText("もう一度パスワードを入力してください")).toBeInTheDocument();
  });
});
