require 'rails_helper'

RSpec.describe "ログイン・ログアウト関連", type: :system do
  before(:each) do
    @user = FactoryBot.create(:testuser)
    @user2 = FactoryBot.create(:testuser2)
  end

  describe "非ログイン時の挙動" do
    it "ログインページにリダイレクトされる" do
      visit edit_user_path(@user)
      expect(current_path).to eq login_path
    end
    it "ログインした後はアクセスしようとしたページに飛ぶ" do
      visit edit_user_path(@user)
      fill_in 'Email', with: 'email@email.com'
      fill_in 'Password', with: 'password'
      click_on 'Login'
      expect(current_path).to eq edit_user_path(@user)
    end
  end

  describe "ログイン時の挙動" do
    context "ログイン成功時" do
      before do
        visit login_path
        fill_in 'Email', with: 'email@email.com'
        fill_in 'Password', with: 'password'
        click_on 'Login'
      end
      it "そのユーザーのページにリダイレクトされる" do
        expect(current_path).to eq user_path(@user)
      end
      it "ヘッダーの内容が変化する" do
        expect(page).to have_content 'マイページ'
      end
      it "ウェルカムメッセージが表示される" do
        expect(page).to have_content 'ようこそいらっしゃいました'
      end
      it "再読み込みするとメッセージが消える" do
        visit current_path
        expect(page).not_to have_content 'ようこそいらっしゃいました'
      end
    end
    context "ログイン中" do
      before do
        visit login_path
        fill_in 'Email', with: 'email@email.com'
        fill_in 'Password', with: 'password'
        click_on 'Login'
      end
      it "edit_user_path にアクセスできる" do
        visit edit_user_path(@user)
        expect(current_path).to eq edit_user_path(@user)
      end
      it "プロフィールを編集できる" do
        visit edit_user_path(@user)
        fill_in 'Name', with: 'Another Man'
        click_on 'Update My Information'
        expect(page).to have_content 'Another Man'
      end
      it "他人の edit_user_path にアクセスしようとすると root_path にリダイレクトされる" do
        visit edit_user_path(@user2)
        expect(current_path).to eq root_path
      end
    end
    context "ログイン失敗時" do
      before do
        # ログインに失敗する
        visit login_path
        fill_in 'Email', with: 'email@email.com'
        fill_in 'Password', with: 'wrong-password'
        click_on 'Login'
      end
      it "再びログインページが読まれる" do
        expect(current_path).to eq login_path
      end
      it "エラーメッセージが表示される" do
        expect(page).to have_content 'emailとpasswordの組み合わせが正しくありません'
      end
    end
  end

  describe "ログアウト時の挙動" do
    before do
       # ログインする
      visit login_path
      fill_in 'Email', with: 'email@email.com'
      fill_in 'Password', with: 'password'
      click_on 'Login'
      # ログアウトする
      click_on 'ログアウト'
    end
    it "ルートページにリダイレクトされる" do
      expect(current_path).to eq root_path
    end
    it "ヘッダーの内容が変化する" do
      expect(page).to have_content 'ログイン'
    end
    it "edit_user_path にアクセスできない" do
      visit edit_user_path(@user)
      expect(current_path).not_to eq edit_user_path(@user)
    end
    it "フラッシュメッセージが正しく表示される" do
      visit edit_user_path(@user)
      expect(page).to have_content "ログインしてください"
    end
  end
end
