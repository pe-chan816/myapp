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
        expect(@json['user']).to include("name" => "TEST_USER_1",
                                         "email" => "email@email.com")
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

end
