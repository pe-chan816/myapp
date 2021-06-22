require 'rails_helper'

RSpec.describe "ハッシュタグ関連", type: :system do
  before do
    @user = FactoryBot.create(:testuser)
    @tweet = @user.tweets.create(content: "TEST_TWEET #test_tag")
    login_as_testuser
  end

  describe "ツイートに書かれているハッシュタグの挙動" do
    it "リンクになった #xxx をクリックするとそのページにリダイレクトされる" do
      visit root_path
      click_on "#test_tag"
      expect(current_path).to eq "/hashtag/test_tag"
    end
  end

  describe "タグ詳細ページの挙動について" do
    it "#xxx のタグページに関連ツイートが表示されている" do
      visit "/hashtag/test_tag"
      expect(page).to have_content "TEST_TWEET #test_tag"
    end

    # マップ表示用のdivの存在確認 capybaraでのgooglemapのテストの方法が分かり次第書き換えたい
    it "緯度経度のデータがあるタグの詳細ページでは地図が表示される" do
      @tag = FactoryBot.create(:hashtag)
      visit "/hashtag/tag"
      expect(page).to have_selector '#map'
    end

    # マップ表示用のdivの存在確認 capybaraでのgooglemapのテストの方法が分かり次第書き換えたい
    it "緯度経度のデータのないタグの詳細ページでは地図は表示されない" do
      visit "/hashtag/test_tag"
      expect(page).not_to have_selector '#map'
    end

    it "レシピ登録をすると詳細ページに表示されるようになる" do
      @tag = FactoryBot.create(:hashtag)
      visit '/hashtag/tag'
      expect(page).not_to have_content 'ウイスキー : 60ml'
      visit edit_hashtag_path(@tag)
      fill_in 'hashtag_recipes_attributes_0_material', with: 'ウイスキー'
      fill_in 'hashtag_recipes_attributes_0_amount', with: '60'
      select 'ml', from: 'hashtag_recipes_attributes_0_unit'
      click_on 'レシピ登録'
      expect(page).to have_content 'ウイスキー : 60ml'
    end
  end

  describe "タグ編集ページの挙動について" do
    # マップ表示用のdivの存在確認 capybaraでのgooglemapのテストの方法が分かり次第書き換えたい
    it "検索用にマップが表示されている" do
      @tag = FactoryBot.create(:hashtag)
      visit edit_hashtag_path(@tag)
      expect(page).to have_selector '#map1'
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
