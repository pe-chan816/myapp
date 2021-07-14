import { Router } from 'react-router-dom';

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from 'history'

import NotLoginHomeHeader from "home/notLoginHomeHeader";

afterEach(cleanup);

const renderDom = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      < NotLoginHomeHeader />
    </Router>
  );
};

describe("非ログイン時のホームヘッダー", () => {
  it("各ヘッダー要素が表示されている", () => {
    renderDom();
    expect(screen.getByText("Insyutagram")).toBeInTheDocument();
    expect(screen.getByText("ログイン")).toBeInTheDocument();
    expect(screen.getByText("アカウント登録")).toBeInTheDocument();
  });

  it("'Insyutagram'のリンクが正常に作動する", () => {
    renderDom();
    const target = screen.getByText("Insyutagram");
    fireEvent.click(target);
    expect(screen.getByText("Welcome to my App!!")).toBeInTheDocument();
  });

  it("'ログイン'のリンクが正常に作動する", () => {
    renderDom();
    const target = screen.getByText("ログイン");
    fireEvent.click(target);
    expect(screen.getByText("アカウントログイン")).toBeInTheDocument();
  });

  it("'アカウント登録'のリンクが正常に作動する", () => {
    renderDom();
    const target = screen.getByText("アカウント登録");
    fireEvent.click(target);
    expect(screen.getByText("新規アカウント登録")).toBeInTheDocument();
  });
});
