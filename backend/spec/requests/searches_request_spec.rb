require 'rails_helper'

RSpec.describe "Searches", type: :request do
  describe "searches#search" do
    let(:user) { FactoryBot.create(:testuser) }
    let(:tag) { FactoryBot.create(:hashtag) }

    before do
      user
      tag
      keyword = "test"
      login_as_testuser
      get "/search/#{keyword}"
      @json = JSON.parse(response.body)
    end

    it "ユーザー情報が返ってくる" do
      expect(@json['searched_user'][0]).to include(
        "id" => user.id,
        "name" => user.name
      )
    end

    it "ハッシュタグ情報が返ってくる" do
      expect(@json['searched_tag'][0]).to include(
        "hashname" => tag.hashname,
        "id" => tag.id
      )
    end

    it "ツイート情報が返ってくる" do
      expect(@json['searched_tweet'][0]).to include(
        "content" => user.tweets.last.content,
        "id" => user.tweets.last.id,
        "name" => user.name,
        "user_id" => user.id
      )
    end
  end
end
