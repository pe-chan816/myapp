require 'rails_helper'

RSpec.describe Favorite, type: :model do
  describe "バリデーションについて" do
    before do
      @favorite = FactoryBot.create(:favorite)
    end

    describe ":user_id について" do
      it "存在していなければならない" do
        expect(@favorite.user_id.present?).to eq true
        @favorite.user_id = nil
        expect(@favorite.valid?).to eq false
      end
    end

    describe ":tweet_id について" do
      it "存在していなければならない" do
        expect(@favorite.tweet_id.present?).to eq true
        @favorite.tweet_id = nil
        expect(@favorite.valid?).to eq false
      end
    end
  end
end
