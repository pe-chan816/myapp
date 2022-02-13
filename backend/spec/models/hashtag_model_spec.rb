require 'rails_helper'

RSpec.describe Hashtag, type: :model do
  describe "バリデーションについて" do
    describe ":hashnameについて" do
      before do
        @hashtag = FactoryBot.create(:tag)
      end

      it "存在していなければならない" do
        @hashtag.hashname = nil
        expect(@hashtag.valid?).to eq false
      end

      it "99文字以内でなければならない" do
        @hashtag.hashname = "a"*99
        expect(@hashtag.valid?).to eq true
        @hashtag.hashname = "a"*100
        expect(@hashtag.valid?).to eq false
      end
    end
  end
 end
