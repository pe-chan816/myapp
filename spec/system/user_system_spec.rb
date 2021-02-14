require 'rails_helper'

RSpec.describe "ユーザーアカウント関連", type: :system do
  before(:each) do
    @user = FactoryBot.create(:testuser)
  end
  describe "ログイン時の挙動" do
    context "ログイン成功時" do
      before do
        # ログインする
        visit login_path
        fill_in 'Email', with: 'email@email.com'
        fill_in 'Password', with: 'password'
        click_on 'Login'
      end
      it "そのユーザーのページにリダイレクトされる" do
        expect(current_path).to eq user_path(@user)
      end
      it "ウェルカムメッセージが表示される" do
        expect(page).to have_content 'ようこそいらっしゃいました'
      end
      it "再読み込みするとメッセージが消える" do
        visit current_path
        expect(page).not_to have_content 'ようこそいらっしゃいました'
      end
      it "ヘッダーの内容が変化する" do
        expect(page).to have_content 'マイページ'
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
  end
end
