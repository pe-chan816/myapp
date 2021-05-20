require 'rails_helper'

RSpec.describe User, type: :model do

  describe "バリデーションについて" do
    let(:user) { FactoryBot.build(:testuser) }

    describe "nameのバリデーション" do
      it "空欄ではない" do
        user.name = nil
        expect(user.valid?).to eq(false)
      end
      it "31字以上ではない" do
        user.name = "a"*31
        expect(user.valid?).to eq(false)
      end
      it "30字以内である" do
        user.name = "a"*30
        expect(user.valid?).to eq(true)
      end
    end

    describe "emailのバリデーション" do
      it "空欄ではない" do
        user.email = nil
        expect(user.valid?).to eq(false)
      end
      it "256字以上ではない" do
        user.email = "a"*246 + "@email.com"
        expect(user.valid?).to eq(false)
      end
      it "255字以内である" do
        user.email = "a"*245 + "@email.com"
        expect(user.valid?).to eq(true)
      end
      it "HTMLのメールアドレスの正規表現に近いアドレスである" do
        expect(user.valid?).to eq(true)
      end
      it "@の後ろのドメイン名に'.'が連続していない" do
        user.email = "email@email..com"
        expect(user.valid?).to eq(false)
      end
      it "重複したメールアドレスは登録できない" do
        user2 = user.dup
        user.save
        expect(user2.valid?).to eq(false)
      end
    end

    describe "passwordのバリデーション" do
      it "8文字以上必要である" do
        user.password = "a"*8
        user.password_confirmation = "a"*8
        expect(user.valid?).to eq(true)
      end
      it "7文字以下はダメである" do
        user.password = "a"*7
        user.password_confirmation = "a"*7
        expect(user.valid?).to eq(false)
      end
    end
  end

  describe "永続セッションを用いたログイン機能について" do
    let(:user) { FactoryBot.create(:testuser) }
    before do
      user.remember
    end

    describe "rememer メソッド" do
      it "正常に :remember_digest に値が入る" do
        expect(user.remember_digest).not_to eq nil
      end
    end

    describe "forget メソッド" do
      it ":remember_digest が空になる" do
        user.forget
        expect(user.remember_digest).to eq nil
      end
    end

    describe "authenticed? メソッド" do
      it ":remember_digest 保存時と同じ remember_token を使えば認証が通る" do
        authenticate_result = user.authenticated?(user.remember_token)
        expect(authenticate_result).to eq true
      end
      it ":remember_digest が空であれば false が返る" do
        user.remember_digest = nil
        authenticate_result = user.authenticated?(user.remember_token)
        expect(authenticate_result).to eq false
      end
    end
  end

  describe "Tweetモデルとの関連付け" do
    before do
      @user = FactoryBot.create(:testuser)
      @tweet = @user.tweets.create(content:"TestTweet")
    end
    it "関連付けが成功している" do
      expect(@tweet.user_id).to eq @user.id
    end
    it "Userをdestroyすると関連付けられたTweetsもdestroyされる" do
      # testuser に30ツイート分紐づけてあるから by(-31)で検証
      expect{@user.destroy}.to change{Tweet.count}.by(-31)
    end
  end


  describe "ユーザーフォロー機能について" do
    before do
      @user = FactoryBot.create(:testuser)
      @user2 = FactoryBot.create(:testuser2)
    end

    describe "follow メソッド" do
      it "正常に機能している" do
        expect(@user.following?(@user2)).to eq false
        @user.follow(@user2)
        expect(@user.following?(@user2)).to eq true
      end
    end

    describe "unfollow メソッド" do
      it "正常に機能している" do
        @user.follow(@user2)
        expect(@user.following?(@user2)).to eq true
        @user.unfollow(@user2)
        expect(@user.following?(@user2)).to eq false
      end
    end
  end
end
