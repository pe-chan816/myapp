require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "sessions#create" do
    let(:user) { FactoryBot.create(:testuser) }

    context "認証に成功" do
      before do
        user
        post login_url, params: { user: {
          email: user.email,
          password: "password"
        }}

        @json = JSON.parse(response.body)
      end

      it "ログインステータスが返ってくる" do
        expect(@json['logged_in']).to eq true
      end

      it "ユーザー情報が返ってくる" do
        expect(@json['user']).to include(
          "email" => user.email,
          "id" => user.id,
          "name" => user.name
        )
      end
    end

    context "認証に失敗" do
      before do
        user
        post login_url, params: { user: {
          email: user.email,
          password: "false_password"
        }}

        @json = JSON.parse(response.body)
      end

      it "ステータスコード401が返ってくる" do
        expect(@json['status']).to eq 401
      end

      it "メッセージが返ってくる" do
        expect(@json['errors']).to include(
          "認証に失敗しました。",
          "正しいメールアドレス・パスワードを入力し直すか、新規登録を行ってください。"
        )
      end
    end
  end
end
