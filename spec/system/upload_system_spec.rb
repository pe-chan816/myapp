require 'rails_helper'

RSpec.describe "画像アップロード関連", type: :system do
  before do
    @user = FactoryBot.create(:testuser)
    login_as_testuser
  end

  describe "プロフィール画像について" do
    it "正常に貼り付けができる" do
      visit edit_user_path(@user)
      attach_file 'user[profile_image]', "#{Rails.root}/spec/fixtures/images/tuna_image.jpeg"
      click_on 'Update My Information'
      expect(current_path).to eq user_path(@user)
      expect(page).to have_selector("img[src$='tuna_image.jpeg']")
    end
  end

  describe "ツイートへの画像添付について" do
    it "正常に貼り付けができる" do
      visit root_path
      fill_in 'tweet[content]', with: "test tweet"
      attach_file 'tweet[tweet_image]', "#{Rails.root}/spec/fixtures/images/tuna_image.jpeg"
      click_on 'Send'
      expect(current_path).to eq root_path
      expect(page).to have_selector("img[src$='tuna_image.jpeg']")
    end
  end
end
