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
    expect(screen.queryByPlaceholderText("もう一度パスワードを入力してください")).not.toBeInTheDocument();
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
        });;

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );

      userEvent.click(screen.getByRole("link", { name: "アカウント登録" })) //アカウント作成画面に移動
    });

    const nameForm = screen.getByPlaceholderText("ハンドルネーム");
    const emailForm = screen.getByPlaceholderText("メールアドレス");;
    const passwordForm = screen.getByPlaceholderText("パスワード");
    const button = screen.getByRole("button", { name: "アカウント作成" });

    act(() => {
      userEvent.type(nameForm, "somebody");
      userEvent.type(emailForm, "email@email.com");
      userEvent.type(passwordForm, "password");
    });

    act(() => {
      const passConfForm = screen.getByPlaceholderText("もう一度パスワードを入力してください");
      userEvent.type(passConfForm, "password");
    });

    act(() => { userEvent.click(button); });

    expect(await screen.findByText("ノンアルコールでお願いします")).toBeInTheDocument();
  });
});

describe("アカウント作成失敗時の挙動", () => {
  it("エラーメッセージが表示される", async () => {
    act(() => {
      render(<Signup />);
    })
    const button = screen.getByRole("button", { name: "アカウント作成" });

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
    const button = screen.getByRole("button", { name: "アカウント作成" });

    const mock = new MockAdapter(axios);
    mock.onPost("http://localhost:3000/signup")
      .reply(200, { messages: ["some error message"] });

    act(() => { userEvent.type(passwordForm, "wrong_password"); });
    act(() => {
      const passConfForm = screen.getByPlaceholderText("もう一度パスワードを入力してください");
      userEvent.type(passConfForm, "very_wrong_password");
    });
    act(() => { userEvent.click(button); });

    expect(await screen.findByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("もう一度パスワードを入力してください")).not.toBeInTheDocument();
  });
});
