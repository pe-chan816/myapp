require 'rails_helper'

RSpec.describe "Users", type: :request do

  describe "new メソッド" do
    describe "GET /signup" do
      it "正しくページを開ける" do
        get "/signup"
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "show メソッド" do
    describe "ユーザーの個人ページ" do
      it "正しく開ける" do
        user = FactoryBot.create(:testuser)
        get user_path(user)
        expect(response).to have_http_status(:success)
      end
    end
  end

end
