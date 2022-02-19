require 'rails_helper'

RSpec.describe "Home", type: :request do
  describe "home#home" do
    context "ログイン中" do
      let(:user) { FactoryBot.create(:testuser) }

      before do
        user
        login_as_testuser
        get root_url
        @json = JSON.parse(response.body)
      end

      it "タイムラインのデータが返ってくる" do
        tweet = user.tweets.first
        expect(@json['home_data'][0]).to include(
          "content" => tweet.content,
          "id" => tweet.id,
          "name" => user.name,
          "user_id" => user.id
        )
      end

      it "タイムラインのデータ数が返ってくる" do
        expect(@json['home_data_count']).to eq 31
      end
    end
  end
end
