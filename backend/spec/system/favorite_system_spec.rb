require 'rails_helper'

RSpec.describe "いいね関連", type: :system do
  describe "ツイートにいいねをつける場合" do
    before do
      @user = FactoryBot.create(:testuser2)
      @tweet = Tweet.first
      login_as_testuser2
      visit root_path
    end

    it "いいねボタンを押すといいね取り消しボタンに切り替わる", js: true do
      expect(page).to have_button 'いいね'
      click_on 'いいね'
      expect(page).not_to have_button 'いいね'
      expect(page).to have_button '取り消し'
    end

    it "いいねボタンを押すといいねカウントが増える", js: true do
      expect(page).to have_selector "#favorite_count_tweet_id#{@tweet.id}", text: '0'
      click_on 'いいね'
      expect(page).to have_selector "#favorite_count_tweet_id#{@tweet.id}", text: '1'
    end

    it "いいね一覧に表示される" do
      visit favorite_user_path(@user)
      expect(page).not_to have_content 'Test Tweet'
      visit root_path
      click_on 'いいね'
      visit favorite_user_path(@user)
      expect(page).to have_content 'Test Tweet'
    end

    it "いいねユーザー一覧に表示される" do
      click_link '', href: favorite_tweet_path(@tweet)
      expect(page).not_to have_content "#{@user.name}"
      visit root_path
      click_on 'いいね'
      click_link '', href: favorite_tweet_path(@tweet)
      expect(page).to have_content "#{@user.name}"
    end
  end

  describe "いいねを解除する場合", js: true do
    before do
      FactoryBot.create(:favorite)
      @user = User.first
      @tweet = Tweet.first
      login_as_testuser2
      visit root_path
    end

    it "取り消しボタンを押すといいねボタンに切り替わる", js: true do
      expect(page).to have_button '取り消し'
      click_on '取り消し'
      expect(page).not_to have_button '取り消し'
      expect(page).to have_button 'いいね'
    end

    it "取り消しボタンを押すといいねカウント減る", js: true do
      expect(page).to have_selector "#favorite_count_tweet_id#{@tweet.id}", text: '1'
      click_on '取り消し'
      expect(page).to have_selector "#favorite_count_tweet_id#{@tweet.id}", text: '0'
    end

    it "いいね一覧から消える", js: true do
      visit favorite_user_path(@user)
      expect(page).to have_content 'Test Tweet'
      click_on '取り消し'
      visit current_path
      expect(page).not_to have_content 'Test Tweet'
    end

    it "いいねユーザー一覧から消える" do
      click_link '', href: favorite_tweet_path(@tweet)
      expect(page).to have_content "#{@user.name}"
      visit root_path
      click_on '取り消し'
      click_link '', href: favorite_tweet_path(@tweet)
      expect(page).not_to have_content "#{@user.name}"
    end
  end
end
