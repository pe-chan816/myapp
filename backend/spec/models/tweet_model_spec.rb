require 'rails_helper'

RSpec.describe Tweet, type: :model do
  describe "バリデーションについて" do
    before(:each) do
      @tweet = FactoryBot.create(:tweet)
    end
    it ":user_id が存在している" do
      expect(@tweet.user_id).not_to eq nil
    end
    it ":content は140字以内である" do
      # 141字はアウト
      @tweet.content = "a"*141
      expect(@tweet.valid?).to eq false
      # 140字はセーフ
      @tweet.content = "a"*140
      expect(@tweet.valid?).to eq true
    end
    it ":content は空欄ではない" do
      @tweet.content = ""
      expect(@tweet.valid?).to eq false
    end
  end
end
