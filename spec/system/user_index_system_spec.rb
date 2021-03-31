require 'rails_helper'

RSpec.describe "ユーザー一覧関連", type: :system do
  describe "ページネーションの挙動" do
    before do
      FactoryBot.rewind_sequences
      FactoryBot.create_list(:users, 30)
      @user = FactoryBot.create(:testuser)
      visit login_path
      fill_in 'Email', with: 'email@email.com'
      fill_in 'Password', with: 'password'
      click_on 'Login'
    end

    it "ユーザー一覧にアクセスできる" do
      visit users_path
      expect(current_path).to eq users_path
    end
    it "ページネーションが設定通り機能している（per.10）" do
      visit users_path
      expect(page).to have_content 'FAKE_USER1'
    end
    it "ページネーションが設定通り機能している（per.10）" do
      visit users_path
      expect(page).to have_content 'FAKE_USER10'
    end
    it "ページネーションが設定通り機能している（per.10）" do
      visit users_path
      click_on 'Next ›'
      expect(page).to have_content 'FAKE_USER11'
    end
  end
end
