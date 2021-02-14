require 'rails_helper'

RSpec.describe "Sessions", type: :request do

  describe "new メソッド" do
    context "GET /login" do
      it "正常にページを開ける" do
        get "/login"
        expect(response).to have_http_status(:success)
      end
    end
  end

end
