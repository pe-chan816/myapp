require 'rails_helper'

RSpec.describe "ゲストユーザー関連", type: :system do
  before do
    @guest = FactoryBot.create(:guest)
    visit login_path
    click_on "Guest Login"
  end


  describe "ログイン機能" do
    it "正常にログインできる" do
      expect(current_path).to eq user_path(@guest)
      expect(page).to have_content "GUEST_USER"
    end
  end


  describe "ユーザー編集画面" do
    before do
      visit edit_user_path(@guest)
    end

    it "編集ボタンを押せない" do
      expect(page).not_to have_button "Update My Information"
    end

    it "Delete this User を押せない" do
      expect(page).not_to have_link "Delete this User"
    end
  end
end
