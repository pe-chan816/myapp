require 'rails_helper'

RSpec.describe "ユーザー作成関連", type: :system do
  describe "アカウント作成時の挙動" do
    context "アカウント作成成功" do
      before do
        visit signup_path
        fill_in 'Name', with: 'somebody_A'
        fill_in 'Email', with: 'email@email.com'
        fill_in 'Password', with: 'password'
        fill_in 'Check your password', with: 'password'
        click_on 'Signup'
      end
      it "そのユーザーのページにリダイレクトされる" do
        expect(page).to have_content 'somebody_A'
      end
      it "ヘッダーの内容が変化している" do
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

    context "アカウント作成失敗" do
      before do
        visit signup_path
        fill_in 'Name', with: 'somebody_A'
        fill_in 'Email', with: 'email@email.com'
        fill_in 'Password', with: 'password'
        fill_in 'Check your password', with: 'wrong_password'
        click_on 'Signup'
      end
      it "エラーメッセージが表示される" do
        expect(page).to have_content "Password confirmation doesn't match Password"
      end
      it "サインアップページのままである" do
        expect(current_path).to eq signup_path
      end
    end
  end
end
