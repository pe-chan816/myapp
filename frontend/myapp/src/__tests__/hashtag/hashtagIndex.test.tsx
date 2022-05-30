import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);
import { jestMockMatchMedia } from 'test-utilities/jestMockMatchMedia';

afterEach(cleanup);
beforeEach(() => {
  jestMockMatchMedia({
    media: '',
    matches: false
  });
});

describe("ハッシュタグ一覧の挙動", () => {
  const renderLoginSituation = () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    // AppのcheckLoginStatusでのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      });
    mock.onGet("http://localhost:3000/hashtags")
      .reply(200, {
        hashtags: [
          {
            hashname: "ビール",
            count: 5
          },
          {
            hashname: "ハートランド",
            count: 2
          }
        ]
      });

    act(() => {
      render(
        <Router history={history}>
          <App />
        </Router>
      );
    });
  };

  it("各要素が正常に表示されている", async () => {
    renderLoginSituation();
    await screen.findAllByText("マイページ");
    const dehazeIcon = screen.getByTestId("dehaze-icon");
    act(() => { userEvent.click(dehazeIcon) });

    const tagIndexLink = await screen.findByText("タグ一覧");
    act(() => { userEvent.click(tagIndexLink) });

    expect(await screen.findByText("ハッシュタグ一覧")).toBeInTheDocument();
    expect(await screen.findByText("ビール(5)")).toBeInTheDocument();
    expect(await screen.findByText("ハートランド(2)")).toBeInTheDocument();
  });
});
