import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("マイページの挙動", () => {
  const renderLoginSituation = async () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    // AppのcheckLoginStatusでのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      });
    //myPage用
    mock.onGet("http://localhost:3000/users/1")
      .reply(200, {
        user: {
          id: 1,
          name: "ボウモアおじさん",
          self_introduction: "アイラ好きの三十路です"
        },
        mypage_data: [
          {
            id: 1,
            content: "アイラしか勝たん",
            user_id: 1,
            name: "ボウモアおじさん",
            hashname: [{
              hashname: "ウイスキー"
            }, {
              hashname: "シングルモルト"
            }]
          }, {
            id: 2,
            content: "仕事終わりの一杯",
            user_id: 1,
            name: "ボウモアおじさん",
          }],
        followings: [{
          name: "フォロー中の人",
          self_introduction: "フォロー中の人です！"
        }],
        followings_count: 5,
        followers: [{
          name: "フォロワーの人",
          self_introduction: "フォロワーの人です！"
        }],
        followers_count: 4,
        follow_or_not: false
      });

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    });
  };

  const myPageContents = async () => {
    expect(await screen.findAllByText("ボウモアおじさん"))//.toBeInTheDocument();
    expect(screen.getByText("アイラ好きの三十路です")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); //フォロー人数
    expect(screen.getByText("4")).toBeInTheDocument(); //フォロワー人数

    expect(screen.getByText("アイラしか勝たん")).toBeInTheDocument();
    expect(screen.getByText("#ウイスキー")).toBeInTheDocument();
    expect(screen.getByText("#シングルモルト")).toBeInTheDocument();

    expect(screen.getByText("仕事終わりの一杯")).toBeInTheDocument();
  };

  it("各要素が正常に表示されている", async () => {
    renderLoginSituation();
    const myPageLink = await screen.findByText("マイページ");
    act(() => { userEvent.click(myPageLink) });

    await myPageContents();
  });

  it("ユーザー名のリンクをクリックするとそのユーザーのページに飛ぶ", async () => {
    renderLoginSituation();
    const myPageLink = await screen.findByText("マイページ");
    act(() => { userEvent.click(myPageLink) });

    const target = await screen.findAllByText("ボウモアおじさん");
    act(() => { userEvent.click(target[0]) });

    // 同じmypageなので表示内容に変化はない
    await myPageContents();
  });

  it("フォロー人数のリンクをクリックするとフォロー中のユーザーが表示される", async () => {
    renderLoginSituation();
    const myPageLink = await screen.findByText("マイページ");
    act(() => { userEvent.click(myPageLink) });

    const target = await screen.findByText("5");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("フォロー中の人")).toBeInTheDocument();
    expect(screen.getByText("フォロー中の人です！")).toBeInTheDocument();
  });

  it("フォロワー人数のリンクをクリックするとフォロワーが表示される", async () => {
    renderLoginSituation();
    const myPageLink = await screen.findByText("マイページ");
    act(() => { userEvent.click(myPageLink) });

    const target = await screen.findByText("4");
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("フォロワーの人")).toBeInTheDocument();
    expect(screen.getByText("フォロワーの人です！")).toBeInTheDocument();
  });
});
