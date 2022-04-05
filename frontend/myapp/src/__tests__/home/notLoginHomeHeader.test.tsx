import { Router } from 'react-router-dom';

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory } from 'history'

import App from "App";

import { jestMockMatchMedia } from 'test-utilities/jestMockMatchMedia';

afterEach(cleanup);

const renderDom = () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      < App />
    </Router>
  );
};

describe("非ログイン時のホームヘッダー", () => {
  beforeEach(() => {
    jestMockMatchMedia({
      media: '',
      matches: false
    });
  });

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
    expect(screen.getByText(/Insyutagram へようこそ！/)).toBeInTheDocument();
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
