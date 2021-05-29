require 'rails_helper'

RSpec.describe "検索機能関連", type: :system do
  describe "ツイート検索" do
    before do
      FactoryBot.create(:testuser)
      login_as_testuser
      visit root_path
    end
    it "正常に機能する（完全一致）" do
      fill_in 'search_word', with: "This is No.1 message."
      click_on 'search'
      expect(current_path).to eq search_path
      expect(page).to have_content "This is No.1 message."
    end

    it "正常に機能する（部分一致）" do
      fill_in 'search_word', with: "No.1"
      click_on 'search'
      expect(current_path).to eq search_path
      expect(page).to have_content "This is No.1 message."
    end
  end
end
