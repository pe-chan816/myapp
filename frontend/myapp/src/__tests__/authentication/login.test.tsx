import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import Login from "login/login";

afterEach(cleanup);

const renderDom = () => {
  render(
    <Login />
  );
};

describe("ログインフォーム", () => {
  it("各要素が正しく表示されている", () => {
    renderDom();
    expect(screen.getByPlaceholderText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
    expect(screen.getByText("!!ログイン!!")).toBeInTheDocument();
  });
});
