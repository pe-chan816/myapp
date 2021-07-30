import axios from "axios";
import { Router } from "react-router-dom";

import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("ゲストログイン機能の挙動", () => {
  it("ログインボタンを押すとログイン状態になりHomeHeaderに切り替わる", async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    //ログインボタンを押したとき
    mock.onGet("http://localhost:3000/guest")
      .reply(200, {
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

    const signupLink = await screen.findByRole("link", { name: "アカウント登録" });
    act(() => { userEvent.click(signupLink) });

    const loginButton = await screen.findByRole("button", { name: "ゲストとして利用してみる" });
    act(() => { userEvent.click(loginButton); });

    expect(await screen.findByText("ノンアルコールでお願いします")).toBeInTheDocument();
  });
});
