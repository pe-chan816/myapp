require 'rails_helper'

RSpec.describe "ツイート機能について", type: :system do
  describe "home#homeでの表示" do
    before do
      @user = FactoryBot.create(:testuser)
      visit login_path
      fill_in 'Email', with: "email@email.com"
      fill_in 'Password', with: "password"
      click_on 'Login'
      visit root_path
    end

    describe "ページネーションの挙動" do
      it "ページネーションが設定通り機能している（最初のページper.20）" do
        # default_scope -> {order(created_at: :desc)} してるから新しい順
        expect(page).to have_content "This is No.30 message."
        expect(page).to have_content "This is No.11 message."
        expect(page).not_to have_content "This is No.10 message."
      end

      it "ページネーションが設定通り機能している（次のページper.10）" do
        click_on 'Next'
        expect(page).not_to have_content "This is No.11 message."
        expect(page).to have_content "This is No.10 message."
        expect(page).to have_content "This is No.1 message."
      end
    end
  end


  describe "user#showでの表示" do
    describe "ページネーションの挙動" do
      before do
        @user = FactoryBot.create(:testuser)
        visit login_path
        fill_in 'Email', with: "email@email.com"
        fill_in 'Password', with: "password"
        click_on 'Login'
      end

      it "ページネーションが設定通り機能している（最初のページper.10）" do
        expect(current_path).to eq user_path(@user)
        # default_scope -> {order(created_at: :desc)} してるから新しい順
        expect(page).to have_content "This is No.30 message."
        expect(page).to have_content "This is No.21 message."
        expect(page).not_to have_content "This is No.20 message."
      end

      it "ページネーションが設定通り機能している（次のページper.10）" do
        expect(current_path).to eq user_path(@user)
        click_on 'Next'
        expect(page).not_to have_content "This is No.21 message."
        expect(page).to have_content "This is No.20 message."
        expect(page).to have_content "This is No.11 message."
      end
    end
  end


  describe "ツイート投稿機能" do
    before do
      @user = FactoryBot.create(:testuser)
      visit login_path
      fill_in 'Email', with: "email@email.com"
      fill_in 'Password', with: "password"
      click_on 'Login'
      visit root_path
      fill_in 'tweet[content]', with: "I'm fine."
      click_on 'Send'
    end

    it "正常にツイートができる" do
      visit user_path(@user)
      expect(page).to have_content "I'm fine."
    end

    it "フラッシュメッセージが正しく表示される" do
      expect(page).to have_content "You've got tweeted!"
    end
  end

  describe "ツイート削除機能" do
    before do
      @user = FactoryBot.create(:testuser)
      # なぜか @user.tweets.first で id が最後のツイートが出てきてしまう
      @tweet = @user.tweets.first
      visit login_path
      fill_in 'Email', with: "email@email.com"
      fill_in 'Password', with: "password"
      click_on 'Login'
    end

    describe "home#homeでの挙動" do
      it "正常に削除できる" do
        visit root_path
        expect(page).to have_content "This is No.30 message."
        click_link 'Delete this Tweet', href: tweet_path(@tweet)
        expect(page).not_to have_content "This is No.30 message."
      end

      it "フラッシュメッセージが表示される" do
        visit root_path
        expect(page).to have_content "This is No.30 message."
        click_link 'Delete this Tweet', href: tweet_path(@tweet)
        expect(page).to have_content "ツイートを削除しました"
      end
    end

    describe "user#showでの挙動" do
      it "正常に削除できる" do
        visit user_path(@user)
        expect(page).to have_content "This is No.30 message."
        click_link 'Delete this Tweet', href: tweet_path(@tweet)
        expect(page).not_to have_content "This is No.30 message."
      end

      it "フラッシュメッセージが表示される" do
        visit user_path(@user)
        expect(page).to have_content "This is No.30 message."
        click_link 'Delete this Tweet', href: tweet_path(@tweet)
        expect(page).to have_content "ツイートを削除しました"
      end

      it "他人のツイートについては'Delete this Tweet'が表示されていない" do
        user2 = FactoryBot.create(:testuser2)
        user2.tweets.create(content: "Other's tweet.")
        visit user_path(user2)
        expect(page).to have_content "Other's tweet."
        expect(page).not_to have_content "Delete this Tweet"
      end
    end
  end
end
