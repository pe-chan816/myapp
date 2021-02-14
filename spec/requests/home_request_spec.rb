require 'rails_helper'

RSpec.describe "Homes", type: :request do

  context "new メソッド" do
    describe "GET /" do
      it "正しくページを開ける" do
        get "/"
        expect(response).to have_http_status(:success)
      end
    end
  end

end
