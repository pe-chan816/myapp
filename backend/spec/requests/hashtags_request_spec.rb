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
          hashtag: "test"
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


  describe "hashtags#destroy" do
    let(:tag) { FactoryBot.create(:tag) }
    let(:user) {FactoryBot.create(:testuser)}
    let(:admin) {FactoryBot.create(:administrator)}

    def delete_tag
      delete "/hashtag/#{tag.hashname}"
      @json = JSON.parse(response.body)
    end

    context "adminユーザーが削除する場合" do
      before do
        admin
        tag

        login_as_admin
      end

      context "対象タグが存在する" do
        it "メッセージが返ってくる" do
          delete_tag
          expect(@json['message']).to eq "ハッシュタグ: #{tag.hashname} を削除しました"
        end

        it "ハッシュタグ数が減少する" do
          expect{ delete_tag }.to change{ Hashtag.count }.by(-1)
        end
      end
    end

    context "一般ユーザーが削除しようとする場合" do
      before do
        user
        tag

        login_as_testuser
      end

      it "エラーメッセージが返ってくる" do
        delete_tag
        expect(@json['message']).to eq "削除する権限がありません"
      end

      it "ハッシュタグ数が減少しない" do
        expect{ delete_tag }.to change{ Hashtag.count }.by(0)
      end
    end
  end

  describe "hashtags#update_bar_info" do
    def update_tag
      user
      login_as_testuser
      tag_name = URI.encode_www_form_component(@tag.hashname)

      post "/hashtag/#{tag_name}/edit/bar", params: {
        bar: {
          name: "テスト店舗",
          address: "福岡県福岡市博多区西中洲 xx-xxx",
          phone_number: "xx-xxxx-xxxx",
          lat: 777.777,
          lng: 777.777
        }
      }
    end

    it "新しいバーの情報が返ってくる" do
      @tag = FactoryBot.create(:tag)
      update_tag
      json = JSON.parse(response.body)

      bar = @tag.bars.first
      expect(json['result']).to include(
        "address" => bar.address,
        "hashtag_id" => @tag.id,
        "id" => bar.id,
        "lat" => bar.lat,
        "lng" => bar.lng,
        "name" => bar.name,
        "phone_number" => bar.phone_number
      )
    end

    it "レシピ情報は削除される" do
      @tag = FactoryBot.create(:gin_tonic)
      update_tag

      expect(Hashtag.find(@tag.id).recipes).to eq []
    end
  end


  describe "hashtags#update_recipe" do
    def update_tag
      user
      login_as_testuser
      tag_name = URI.encode_www_form_component(@tag.hashname)

      post "/hashtag/#{tag_name}/edit/recipe", params: {
        recipe: {
          material: "ソーダ水",
          amount: nil,
          unit: "適量"
        }
      }
    end

    it "紐づいているレシピが返ってくる" do
      @tag = FactoryBot.create(:gin_tonic)
      update_tag
      json = JSON.parse(response.body)

      expect(json['recipes'].first).to include(
        "amount" => 45,
        "hashtag_id" => @tag.id,
        "material" => "ジン",
        "unit" => "ml"
      )
      expect(json['recipes'].last).to include(
        "amount" => nil,
        "hashtag_id" => @tag.id,
        "material" => "ソーダ水",
        "unit" => "適量"
      )
    end

    it "バー情報は削除される" do
      @tag = FactoryBot.create(:tender)
      update_tag
      json = JSON.parse(response.body)

      expect(Hashtag.find(@tag.id).bars).to eq []
    end
  end


  describe "hashtags#destroy_recipe" do
    let(:tag) { FactoryBot.create(:gin_tonic) }

    before do
      user
      login_as_testuser
      tag
      recipe = tag.recipes.first

      delete "/hashtag/delete/recipe/#{recipe.id}"
      @json = JSON.parse(response.body)
    end

    it "メッセージが返ってくる" do
      expect(@json['messages']).to eq "レシピ削除完了"
    end

    it "削除したレシピは返ってこない" do
      expect(@json['new_recipe']).not_to include(
        "amount" => 45,
        "material" => "ジン",
        "unit" => "ml"
      )
    end

    it "削除後の残ったレシピが返ってくる" do
      expect(@json['new_recipe'].first).to include(
        "amount" => nil,
        "material" => "トニックウォーター",
        "unit" => "適量"
      )
    end
  end
end
