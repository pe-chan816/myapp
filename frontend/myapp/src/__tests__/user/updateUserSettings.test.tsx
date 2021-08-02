import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

const renderLoginSituation = async (guestOrNot: boolean) => {
  const history = createMemoryHistory();
  const mock = new MockAdapter(axios);
  // AppのcheckLoginStatusでのログインチェック
  mock.onGet("http://localhost:3000/check_login")
    .reply(200, {
      logged_in: true,
      user: {
        id: 1,
        name: "テストユーザー",
        email: "email@email.com",
        guest: guestOrNot,
        self_introduction: "自己紹介",
        unique_name: "test_user"
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
  // アカウント削除
  mock.onDelete("http://localhost:3000/users/1").reply(200);
  // マイページ表示
  mock.onGet("http://localhost:3000/users/1")
    .reply(200, {
      user: {
        id: 1,
        name: "テストユーザー改",
      },
      mypage_data: [{}],
      followings: [{}],
      followings_count: 100,
      followers: [{}],
      followers_count: 50
    });

  act(() => {
    render(
      <Router history={history}>
        <App />
      </Router>
    );
  })

  await screen.findAllByText("マイページ");
  const dehazeIcon = screen.getByTestId("dehaze-icon");
  act(() => { userEvent.click(dehazeIcon) });

  const settingLink = await screen.findByRole("link", { name: "アカウント設定" });
  act(() => { userEvent.click(settingLink) });
};

describe("アカウント設定ページの挙動", () => {
  it("各要素が正常に表示されている", async () => {
    await renderLoginSituation(false);

    expect(screen.getByText("ユーザーアカウント設定")).toBeInTheDocument();
    expect(screen.getByDisplayValue("テストユーザー")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test_user")).toBeInTheDocument();
    expect(screen.getByDisplayValue("自己紹介")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("新しいパスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "アカウント削除" })).toBeInTheDocument();
  });

  it("パスワードに入力をすると確認用フォームが表示される", async () => {
    await renderLoginSituation(false);
    const target = screen.getByPlaceholderText("新しいパスワード");
    act(() => { userEvent.type(target, "something@email.com") });

    expect(await screen.findByPlaceholderText("パスワードをもう一度入力してください")).toBeInTheDocument();
  });

  it("'アカウント削除'ボタンを押すと警告ダイアログが表示される", async () => {
    await renderLoginSituation(false);
    const target = screen.getByRole("button", { name: "アカウント削除" });
    act(() => { userEvent.click(target) });

    expect(await screen.findByText("本当にアカウントを削除しますか？"));
    expect(screen.getByRole("button", { name: "キャンセル" }));
    expect(screen.getByRole("button", { name: "削除する" }));
  });

  it("編集に成功するとフラッシュメッセージが表示されマイページに遷移する", async () => {
    await renderLoginSituation(false);
    const nameInputArea = screen.getByPlaceholderText("テストユーザー");
    const emailInputArea = screen.getByPlaceholderText("email@email.com");
    const editButton = screen.getByRole("button", { name: "編集" });

    await act(async () => {
      userEvent.type(nameInputArea, "テストユーザー改");
      userEvent.type(emailInputArea, "another@email.com");
    });
    act(() => { userEvent.click(editButton) });

    expect(await screen.findByText("テストユーザー改"));
    expect(screen.getByText("100"));
    expect(screen.getByText("50"));
    expect(screen.getByText("アカウント設定を変更しました"));
  });
});

describe("ゲストユーザーでは利用できない機能", () => {
  it("編集ボタンを押すとアラートメッセージが表示される", async () => {
    await renderLoginSituation(true);
    const editButton = await screen.findByRole("button", { name: "編集" });

    act(() => { userEvent.click(editButton) });
    expect(await screen.findByText(/アカウントを作成すると/)).toBeInTheDocument();
  });

  it("アカウント削除ができず、アラートメッセージが表示される", async () => {
    await renderLoginSituation(true);
    const accountDeleteButton = await screen.findByRole("button", { name: "アカウント削除" });

    act(() => { userEvent.click(accountDeleteButton) });
    await screen.findByText("本当にアカウントを削除しますか？");
    const deleteConfirmButton = screen.getByRole("button", { name: "削除する" });

    act(() => { userEvent.click(deleteConfirmButton) });
    expect(await screen.findByText(/ゲストユーザーを削除することはご遠慮いただいています/)).toBeInTheDocument();
  });
});
