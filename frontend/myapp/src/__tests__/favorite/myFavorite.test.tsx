import { Router } from 'react-router-dom';
import axios from 'axios';
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from 'history';

import App from "App";

afterEach(cleanup);

describe("いいね一覧の挙動", () => {
  const renderLoginSituation = () => {
    const history = createMemoryHistory();
    const mock = new MockAdapter(axios);
    // AppのcheckLoginStatusでのログインチェック
    mock.onGet("http://localhost:3000/check_login")
      .reply(200, {
        logged_in: true,
        user: { id: 1 }
      });
    mock.onGet("http://localhost:3000/users/1/myfavorite")
      .reply(200, {
        my_favorites: [
          {
            id: 1,
            content: "とりあえず生",
            user_id: 2,
            name: "通りすがりのビール好き",
            unique_name: "beerholic",
            hashname: [{
              hashname: "ビール"
            }, {
              hashname: "ハートランド"
            }]
          }, {
            id: 2,
            content: "ノンアルコールでお願いします",
            user_id: 3,
            name: "Mr.下戸",
            unique_name: "nondrinker",
            hashname: [{
              hashname: "飲めない"
            }]
          }
        ],
        my_favorite_count: 2
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
    await screen.findByText("マイページ");
    const dehazeIcon = screen.getByTestId("dehaze-icon");
    act(() => { userEvent.click(dehazeIcon) });

    const myFavoriteLink = await screen.findByText("マイいいね");
    act(() => { userEvent.click(myFavoriteLink) });

    expect(await screen.findByText("いいねしたポスト")).toBeInTheDocument();
    expect(screen.getByText("とりあえず生")).toBeInTheDocument();
    expect(screen.getByText("通りすがりのビール好き")).toBeInTheDocument();
    expect(screen.getByText("@beerholic")).toBeInTheDocument();
    expect(screen.getByText("#ビール")).toBeInTheDocument();
    expect(screen.getByText("#ハートランド")).toBeInTheDocument();
    expect(screen.getByText("ノンアルコールでお願いします")).toBeInTheDocument();
    expect(screen.getByText("Mr.下戸")).toBeInTheDocument();
    expect(screen.getByText("@nondrinker")).toBeInTheDocument();
    expect(screen.getByText("#飲めない")).toBeInTheDocument();
  });
});
