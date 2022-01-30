require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "user#create" do
    context "ユーザー作成に成功" do
      before do
        post signup_url, params: { user: FactoryBot.attributes_for(:testuser) }
        @json = JSON.parse(response.body)
      end

      it "レスポンスコード200が返ってくる" do
        expect(response.status).to eq 200
      end

      it "作成したユーザー情報が返ってくる" do
        expect(@json['user']).to include(
          "name" => "TEST_USER_1",
          "email" => "email@email.com"
        )
      end

      it "ランダムな英数字のunique_nameが設定されている" do
        unique_name = @json['user']['unique_name']
        regex = /[\w\+\/]{12}/

        expect(unique_name.match?(regex)).to eq true
      end

      it "ユーザー数が増えている" do
        expect do
          post signup_url, params: { user: FactoryBot.attributes_for(:testuser2) }
        end.to change(User, :count).by(1)
      end
    end

    context "ユーザー作成に失敗" do
      before do
        post signup_url, params: { user: FactoryBot.attributes_for(:testuser, :invalid) }
        @json = JSON.parse(response.body)
      end

      it "エラーメッセージが表示される" do
        expect(@json['messages'][0]).to eq "Nameを入力してください"
        expect(@json['messages'][1]).to eq "Emailを入力してください"
        expect(@json['messages'][3]).to eq "Passwordを入力してください"
      end
    end
  end


  describe "users#update" do
    let(:user) { FactoryBot.create(:testuser) }

    context "ユーザー情報変更に成功" do
      before do
        @new_name = "new_name"
        @new_email = "new@email.com"
        @new_introduction = "hello"
        @new_unique_name = "new_unique"

        patch user_url(user), params: { user: {
          email: @new_email,
          name: @new_name,
          password: "password2",
          password_confirmation: "password2",
          self_introduction: @new_introduction,
          unique_name: @new_unique_name
        }}

        @new_pass = User.find(user.id).password_digest

        @json = JSON.parse(response.body)
      end

      it "変更後のパラメータが返ってくる" do
        expect(@json['user']).to include(
          "email" => @new_email,
          "name" => @new_name,
          "password_digest" => @new_pass,
          "self_introduction" => @new_introduction,
          "unique_name" => @new_unique_name
        )
      end
    end

    context "ユーザー情報変更に失敗" do
      before do
        @invalid_name = "a" * 31

        patch user_url(user), params: { user: {
          name: @invalid_name
        }}

        @json = JSON.parse(response.body)
      end

      it "エラーメッセージが返ってくる" do
        expect(@json['messages'][0]).to eq "Nameは30文字以内で入力してください"
      end
    end
  end


  describe "users#show" do
    before do
      FactoryBot.create(:relationship)
      @user = User.find_by( name: "TEST_USER_1" )
      @user2 = User.find_by( name: "TEST_USER_2" )
      login_as_testuser
      get user_url(@user)

      @json = JSON.parse(response.body)
    end

    it "ユーザー情報が返ってくる" do
      expect(@json['user']).to include(
        "email" => @user.email,
        "id" => @user.id,
        "name" => @user.name
      )
    end

    it "ツイート情報が返ってくる" do
      expect(@json['mypage_data'][0]).to include(
        "content" => "This is No.30 message.",
        "name" => @user.name,
        "user_id" => @user.id
      )
    end

    it "フォロー情報が返ってくる" do
      expect(@json['followings'][0]).to include(
        "email" => @user2.email,
        "id" => @user2.id,
        "name" => @user2.name
      )
    end

    it "フォロー人数が返ってくる" do
      expect(@json['followings_count']).to eq @user.following.count
    end

    it "フォロワー情報が返ってくる" do
      get user_url(@user2)
      json = JSON.parse(response.body)

      expect(json['followers'][0]).to include(
        "email" => @user.email,
        "id" => @user.id,
        "name" => @user.name
      )
    end

    it "フォロワー人数が返ってくる" do
      expect(@json['followers_count']).to eq @user.followers.count
    end

    it "フォローしてるかどうかの情報が返ってくる" do
      expect(@json['follow_or_not']).to eq @user.following?(@user)
    end
  end
end
