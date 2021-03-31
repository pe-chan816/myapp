require 'rails_helper'

RSpec.describe "Users", type: :request do
  include SessionsHelper
  let(:user) {FactoryBot.create(:testuser)}

  describe "new メソッド" do
    describe "GET /signup" do
      it "正しくページを開ける" do
        get "/signup"
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "edit メソッド" do
    describe "GET edit_user_path" do
      it "ログインしていない場合リダイレクトされる" do
        # RequestSpec では session が取り扱えないのでログイン中の挙動は login_system_spec.rb に書く
        get edit_user_path(user)
        expect(response).to have_http_status(:redirect)
      end
    end
  end

  describe "update メソッド" do
    describe "PATCH /users/:id" do
      it  "ログインしていないと更新できない" do
        patch '/users/user.id', params:{name:'Another Man'}
        expect(response).not_to have_http_status(:success)
      end
    end
  end

  describe "show メソッド" do
    describe "ユーザーの個人ページ" do
      it "正しく開ける" do
        get user_path(user)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "index メソッド" do
    it "ログインしていない場合リダイレクトされる" do
      # RequestSpec では session が取り扱えないのでログイン中の挙動は login_system_spec.rb に書く
      get users_path
      expect(response).to have_http_status(:redirect)
    end
  end
end
