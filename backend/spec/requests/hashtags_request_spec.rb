require 'rails_helper'

RSpec.describe "Hashtags", type: :request do
  let(:user) { FactoryBot.create(:testuser) }

  describe "hashtags#show" do
    context "ノーマルタグ" do
      let(:tag) { FactoryBot.create(:tag) }

      before do
        user
        tag_name = URI.encode_www_form_component(tag.hashname)
        login_as_testuser

        post tweets_url, params: {
          tweet: {
            content: "テストツイート"
          },
          hashtag: "テストタグ"
        }

        get "/hashtag/#{tag_name}"
        @json = JSON.parse(response.body)
      end

      it "ハッシュタグの情報が返ってくる" do
        expect(@json['hashtag']).to include(
          "hashname" => tag.hashname,
          "id" => tag.id
        )
      end

      it "関連ツイートが返ってくる" do
        tweet = Tweet.first
        expect(@json['tweets'][0]).to include(
          "content" => tweet.content,
          "id" => tweet.id,
          "name" => user.name,
          "user_id" => user.id
        )
      end

      it "関連ツイート数が返ってくる" do
        expect(@json['tweets_count']).to eq tag.tweets.count
      end
    end

    context "レシピタグ" do
      let(:tag) { FactoryBot.create(:gin_tonic) }

      before do
        user
        tag_name = URI.encode_www_form_component(tag.hashname)
        login_as_testuser

        post tweets_url, params: {
          tweet: {
            content: "ジントニック飲む"
          },
          hashtag: "ジントニック"
        }

        get "/hashtag/#{tag_name}"
        @json = JSON.parse(response.body)
      end

      it "レシピの情報が返ってくる" do
        expect(@json['recipes'][0]).to include(
          "amount" => 45,
          "hashtag_id" => tag.id,
          "material" => "ジン"
        )
      end
    end

    context "バー情報タグ" do
      let(:tag) { FactoryBot.create(:tender) }

      before do
        user
        tag_name = URI.encode_www_form_component(tag.hashname)
        login_as_testuser

        post tweets_url, params: {
          tweet: {
            content: "オーセンティックバーといえば"
          },
          hashtag: "テンダー"
        }

        get "/hashtag/#{tag_name}"
        @json = JSON.parse(response.body)
      end

      it "バー情報が返ってくる" do
        bar = Bar.first
        expect(@json['bar_info'][0]).to include(
          "address" => bar.address,
          "hashtag_id" => bar.hashtag_id,
          "id" => bar.id,
          "lat" => bar.lat,
          "lng" => bar.lng,
          "name" => bar.name,
          "phone_number" => bar.phone_number
        )
      end
    end
  end


  describe "hashtags#index" do
    let(:tag) { FactoryBot.create(:tag) }

    it "ハッシュタグ一覧データが返ってくる" do
      user
      login_as_testuser
      tag
      get hashtags_url
      json = JSON.parse(response.body)

      expect(json['hashtags'][0]).to include(
        "count" => tag.tweets.count,
        "hashname" => tag.hashname,
        "id" => tag.id
      )
    end
  end
end
