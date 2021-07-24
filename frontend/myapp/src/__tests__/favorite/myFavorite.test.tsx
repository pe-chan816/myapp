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
            user_id: 1,
            name: "通りすがりのビール好き",
            hashname: [{
              hashname: "ビール"
            }, {
              hashname: "ハートランド"
            }]
          }, {
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
  };

  it("各要素が正常に表示されている", async () => {
    renderLoginSituation();
    await screen.findAllByText("マイページ");
    const dehazeIcon = screen.getByTestId("dehaze-icon");
    act(() => { userEvent.click(dehazeIcon) });

    const myFavoriteLink = await screen.findByText("マイいいね");
    act(() => { userEvent.click(myFavoriteLink) });

    expect(await screen.findByText("いいねしたツイート")).toBeInTheDocument();
    expect(await screen.findByText("とりあえず生")).toBeInTheDocument();
    expect(await screen.findByText("通りすがりのビール好き")).toBeInTheDocument();
    expect(await screen.findByText("#ビール")).toBeInTheDocument();
    expect(await screen.findByText("#ハートランド")).toBeInTheDocument();
    expect(await screen.findByText("ノンアルコールでお願いします")).toBeInTheDocument();
    expect(await screen.findByText("Mr.下戸")).toBeInTheDocument();
    expect(await screen.findByText("#飲めない")).toBeInTheDocument();
  });
});
