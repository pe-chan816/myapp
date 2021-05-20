require 'rails_helper'

RSpec.describe Relationship, type: :model do
  describe "バリデーションについて" do
    before do
      @relationship = FactoryBot.create(:relationship)
    end

    describe ":follower_id について" do
      it "存在していなければならない" do
        expect(@relationship.follower_id.present?).to eq true
        @relationship.follower_id = nil
        expect(@relationship.valid?).to eq false
      end
    end

    describe ":follewed_id について" do
      it "存在していなければならない" do
        expect(@relationship.followed_id.present?).to eq true
        @relationship.followed_id = nil
        expect(@relationship.valid?).to eq false
      end
    end
  end
end
