require 'rails_helper'

RSpec.describe "Favorites", type: :request do
  let(:user1) { FactoryBot.create(:testuser) }
  let(:user2) { FactoryBot.create(:testuser2) }

  describe "favorites#create" do
    def create_favorite
      post favorites_url, params: {
        favorite_tweet_id: user2.tweets.first.id
      }
    end

    before do
      user1
      user2
      login_as_testuser
    end

    it "メッセージが返ってくる" do
      create_favorite
      json = JSON.parse(response.body)

      expect(json['message']).to eq "いいね！"
    end

    it "対象ツイートのいいね数が増加する" do
      expect{
        create_favorite
      }.to change{ user2.tweets.first.user_favorited.count }.by(1)
    end
  end


  describe "favorites#destroy" do
    def destroy_favorite
      delete unfavorite_url, params: {
        tweet_id: user2.tweets.first.id
      }
    end

    before do
      user1
      user2
      login_as_testuser

      post favorites_url, params: {
        favorite_tweet_id: user2.tweets.first.id
      }
    end

    it "メッセージが返ってくる" do
      destroy_favorite
      json = JSON.parse(response.body)

      expect(json['message']).to eq "いいね解除"
    end

    it "対象ツイートのいいね数が減少する" do
      expect{
        destroy_favorite
      }.to change{ user2.tweets.first.user_favorited.count }.by(-1)
    end
  end
end
