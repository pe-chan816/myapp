require 'rails_helper'

RSpec.describe "Homes", type: :request do
  describe "get /" do
    it "正しく / ルートページを開ける" do
      get "/"
      expect(response).to have_http_status(:success)
    end
  end
end
