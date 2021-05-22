require 'rails_helper'

RSpec.describe "ユーザー一覧関連", type: :system do
  describe "ページネーションの挙動" do
    before do
      FactoryBot.rewind_sequences
      FactoryBot.create_list(:users, 30)
      @user = FactoryBot.create(:testuser)
      login_as_testuser
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


  describe "'Delete this User' の挙動" do
    before do
      @admin = FactoryBot.create(:administrator)
      @user = FactoryBot.create(:testuser)
    end

    context "管理者ユーザーがユーザー削除する場合" do
      before do
        login_as_administrator
      end
      it "users_pathに'Delete this User'が表示されている" do
        visit users_path
        expect(page).to have_content "Delete this User"
      end
      it "正常にユーザー削除できる" do
        visit users_path
        expect(page).to have_content "TEST_USER_1"
        click_link 'Delete this User', href: user_path(@user)
        expect(current_path).to eq users_path
        expect(page).not_to have_content "TEST_USER_1"
      end
      it "user_path(@user)に'Delete this User'が表示されている" do
        visit user_path(@user)
        expect(page).to have_content "Delete this User"
      end
      it "正常にユーザー削除できる" do
        visit user_path(@user)
        click_on 'Delete this User'
        expect(current_path).to eq users_path
        expect(page).not_to have_content 'TEST_USER_1'
      end
    end

    context "一般ユーザーがユーザー削除する場合" do
      before do
        login_as_testuser
      end
      it "users_path に'Delete this User'が表示されていない" do
        visit users_path
        expect(page).not_to have_content "Delete this User"
      end
      it "user_path(@user)に'Delete this User'が表示されていない" do
        visit user_path(@user)
        expect(page).not_to have_content "Delete this User"
      end
      it "自分の edit_user_path に'Delete this User'が表示されている" do
        visit edit_user_path(@user)
        expect(page).to have_content "Delete this User"
      end
      it "正常にユーザー削除できる" do
        visit edit_user_path(@user)
        click_on 'Delete this User'
        login_as_testuser
        expect(page).to have_content "emailとpasswordの組み合わせが正しくありません"
      end
    end
  end
end
