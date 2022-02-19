require 'rails_helper'

RSpec.describe "Relationships", type: :request do
  describe "relationsips#create" do
    let(:user1) { FactoryBot.create(:testuser) }
    let(:user2) { FactoryBot.create(:testuser2) }

    def follow_action
      user1
      user2
      login_as_testuser
      post relationships_url, params: {
        followed_id: user2.id
      }
    end

    context "処理結果" do
      before do
        follow_action
        @json = JSON.parse(response.body)
      end

      it "メッセージが返ってくる" do
        expect(@json['messages']).to eq "フォロー成功"
      end

      it "対象ユーザーのフォロワー数が返ってくる" do
        expect(@json['number_of_followers']).to eq user2.followers.count
      end
    end

    context "処理内容" do
      it "対象ユーザーのフォロワー数が増加する" do
        expect do
          follow_action
        end
        .to change(user2.followers, :count).by(1)
      end
    end
  end


  describe "relationships#unfollow" do
    def unfollow_action
      FactoryBot.create(:relationship)
      @user1 = User.find_by( unique_name: "test1" )
      @user2 = User.find_by( unique_name: "test2" )
      login_as_testuser

      post unfollow_url, params: {
        followed_id: @user2.id
      }
    end

    context "処理結果" do
      before do
        unfollow_action
        @json = JSON.parse(response.body)
      end

      it "メッセージが返ってくる" do
        expect(@json['messages']).to eq "フォロー解除成功"
      end

      it "対象ユーザーのフォロワー数が返ってくる" do
        expect(@json['number_of_followers']).to eq @user2.followers.count
      end
    end

    context "処理内容" do
      it "対象ユーザーのフォロワー数が減少する" do
        FactoryBot.create(:relationship)
        user2 = User.find_by( unique_name: "test2" )
        login_as_testuser

        expect{
          post unfollow_url, params: {
            followed_id: user2.id
          }
        }.to change{ user2.followers.count }.by(-1)
      end
    end
  end
end
