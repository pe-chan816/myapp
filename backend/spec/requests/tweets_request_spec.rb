require 'rails_helper'

RSpec.describe "Tweets", type: :request do
  describe "tweets#create" do
    let(:user) { FactoryBot.create(:testuser) }

    before do
      user
      login_as_testuser
    end

    it "ツイート総数が増加する" do
      expect do
        post tweets_url, params: { tweet: {
          content: "test"
        }}
      end.to change(Tweet, :count).by(1)
    end

    context "ハッシュタグ付きの場合" do
      it "ハッシュタグ総数が増加する" do
        expect do
          post tweets_url, params: {
            tweet: {
              content: "test"
            },
            hashtag: "test_tag"
          }
        end.to change(Hashtag, :count).by(1)
      end
    end
  end

  describe "tweets#destroy" do
    let(:user) { FactoryBot.create(:testuser) }

    before do
      @id = user.tweets.first.id
      login_as_testuser
    end

    it "ツイート総数が減少する" do
      expect do
        delete tweet_url(@id)
      end.to change(Tweet, :count).by(-1)
    end

    it "JSONが返ってくる" do
      delete tweet_url(@id)
      json = JSON.parse(response.body)

      expect(json['message']).to eq "ツイート削除"
    end
  end

  describe "tweets#favorite" do
    before do
      FactoryBot.create(:favorite)
      id = Tweet.first
      get favorite_tweet_url(id)
      @user = User.find_by(name: "TEST_USER_2")
      @json = JSON.parse(response.body)
    end

    it "いいねしたユーザーの情報が返ってくる" do
      expect(@json['favorited_users'][0]).to include(
        "email" => @user.email,
        "name" => @user.name,
        "id" => @user.id
      )
    end

    it "いいね総数が返ってくる" do
      expect(@json['favorite_count']).to eq 1
    end
  end


  describe "tweets#index" do
    before do
      @user = FactoryBot.create(:testuser)
      login_as_testuser
      get tweets_url
      @json = JSON.parse(response.body)
    end

    it "15件分データが返ってくる" do
      expect(@json['hot_tweet_data'].length).to eq 15
    end

    it "ツイート情報が返ってくる" do
      expect(@json['hot_tweet_data'][0]).to include(
        "content" => @user.tweets.first.content,
        "id" => @user.tweets.first.id,
        "name" => @user.name,
        "user_id" => @user.id
      )
    end
  end
end
