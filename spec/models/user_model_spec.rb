require 'rails_helper'

RSpec.describe User, type: :model do

  context "バリデーションについて" do

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
end
