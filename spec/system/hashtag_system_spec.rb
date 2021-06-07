require 'rails_helper'

RSpec.describe "ハッシュタグ関連", type: :system do
  before do
    @user = FactoryBot.create(:testuser)
    @tweet = @user.tweets.create(content: "TEST_TWEET #test_tag")
    login_as_testuser
  end

  describe "ツイートに書かれてたハッシュタグの挙動" do
    it "リンクになった #xxx をクリックするとそのページにリダイレクトされる" do
      visit root_path
      click_on "#test_tag"
      expect(current_path).to eq "/hashtag/test_tag"
    end
  end

  describe "タグページの挙動について" do
    it "#xxx のタグページに関連ツイートが表示されている" do
      visit "/hashtag/test_tag"
      expect(page).to have_content "TEST_TWEET #test_tag"
    end
  end

  describe "タグ一覧ページの挙動について" do
    it "リンクになった #xxx をクリックするとそのタグページにリダイレクトされる" do
      visit hashtags_path
      click_on "#test_tag"
      expect(current_path).to eq "/hashtag/test_tag"
    end

    it "タグがついたツイートが増えるとタグ一覧ページの当該タグのカウントも増える" do
      visit hashtags_path
      expect(page).to have_content '#test_tag(1)'
      @user.tweets.create(content: "TEST_TWEET2! #test_tag")
      visit current_path
      expect(page).to have_content "#test_tag(2)"
    end

    it "タグがついたツイートを削除するとタグ一覧ページの当該タグのカウントも減る" do
      @tweet2 = @user.tweets.create(content: "TEST_TWEET2! #test_tag")
      visit hashtags_path
      expect(page).to have_content "#test_tag(2)"
      @tweet2.destroy
      visit current_path
      expect(page).to have_content "#test_tag(1)"
    end
  end
end
