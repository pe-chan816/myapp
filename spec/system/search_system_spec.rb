require 'rails_helper'

RSpec.describe "検索機能関連", type: :system do
  before do
      @user = FactoryBot.create(:testuser)
      login_as_testuser
      visit root_path
    end

  describe "ツイート検索" do
    before do
      @tweet = Tweet.find_by(content: "This is No.1 message.")
    end

    it "正常に機能する（完全一致）" do
      fill_in 'search_word', with: "#{@tweet.content}"
      click_on 'search'
      expect(current_path).to eq search_path
      expect(page).to have_content "#{@tweet.content}"
    end

    it "正常に機能する（部分一致）" do
      fill_in 'search_word', with: "No.1"
      click_on 'search'
      expect(current_path).to eq search_path
      expect(page).to have_content "#{@tweet.content}"
    end
  end

  describe "ユーザー検索" do
    it "正常に機能する（完全一致）" do
      fill_in 'search_word', with: "#{@user.name}"
      click_on 'search'
      expect(current_path).to eq search_path
      expect(page).to have_content "#{@user.name}"
    end

    it "正常に機能する（部分一致）" do
      fill_in 'search_word', with: "USER_1"
      click_on 'search'
      expect(current_path).to eq search_path
      expect(page).to have_content "#{@user.name}"
    end
  end

  describe "ツイート・ユーザー同時検索" do
    before do
      @tweet = Tweet.find_by(content: "I'm TEST_USER_1")
    end

    it "正常に機能する" do
      fill_in 'search_word', with: "USER_1"
      click_on 'search'
      expect(current_path).to eq search_path
      expect(page).to have_content "#{@tweet.content}"
      expect(page).to have_content "#{@user.name}"
    end
  end
end
