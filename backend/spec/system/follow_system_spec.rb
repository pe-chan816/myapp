require 'rails_helper'

RSpec.describe "フォロー関連", type: :system do
  before do
    FactoryBot.create(:relationship)
    @user = User.find_by(name: 'TEST_USER_1')
    @user2 = User.find_by(name: 'TEST_USER_2')
    @user3 = FactoryBot.create(:testuser3)
  end

  describe "ユーザーフォロー機能" do
    # 実際にフォロー・フォロワー数が変動しているかは'user_model_spec'にて検証
    before do
      login_as_testuser
    end

    describe "フォローをする場合" do
      it "Followボタンを押すと UnFollowボタンに切り替わる", js: true do
        visit user_path(@user3)
        expect(page).to have_button 'Follow'
        click_on 'Follow'
        expect(page).to have_button 'UnFollow'
      end

      it "Followボタンを押すとFollowersカウントが変動する" , js: true do
        visit user_path(@user3)
        expect(page).to have_selector '#number_of_followers', text: '0'
        click_on 'Follow'
        expect(page).to have_selector '#number_of_followers', text: '1'
      end
    end

    describe "フォロー解除をする場合" do
      it "Unfollowボタンを押すとFollowボタンに切り替わる", js: true do
        visit user_path(@user2)
        expect(page).to have_button 'UnFollow'
        click_on 'UnFollow'
        expect(page).to have_button 'Follow'
      end

      it "Unfollowボタンを押すとFollowersカウントが変動する", js: true do
        visit user_path(@user2)
        expect(page).to have_selector '#number_of_followers', text: '1'
        click_on 'UnFollow'
        expect(page).to have_selector '#number_of_followers', text: '0'
      end
    end

    describe "自己フォロー防止について" do
      it "FollowボタンもUnFollowボタンも表示されていない" do
        visit user_path(@user)
        expect(page).not_to have_button 'Follow'
        expect(page).not_to have_button 'UnFollow'
      end
    end
  end


  describe "フォロー・フォロワーリスト関連" do
    describe "フォローリスト" do
      before do
        login_as_testuser
      end

      describe "フォロー数のリンクをクリックしたとき" do
        it "フォローしているユーザーが表示されている" do
          click_link href: following_user_path(@user)
          expect(current_path).to eq following_user_path(@user)
          expect(page).to have_content 'TEST_USER_2'
        end
      end

      describe "フォローリスト内のユーザー名をクリックしたとき" do
        it "対象ユーザーのユーザーページにリダイレクトされる" do
          click_link href: following_user_path(@user)
          expect(current_path).to eq following_user_path(@user)
          click_on 'TEST_USER_2'
          expect(current_path).to eq user_path(@user2)
        end
      end
    end

    describe "フォロワーリスト" do
      before do
        login_as_testuser2
      end

      describe "フォロワー数のリンクをクリックしたとき" do
        it "フォロワーになっているユーザーが表示されている" do
          click_link href: followers_user_path(@user2)
          expect(current_path).to eq followers_user_path(@user2)
          expect(page).to have_content 'TEST_USER_1'
        end
      end

      describe "フォロワーリスト内のユーザー名をクリックしたとき" do
        it "対象ユーザーのユーザーページにリダイレクトされる" do
          click_link href: followers_user_path(@user2)
          expect(current_path).to eq followers_user_path(@user2)
          click_on 'TEST_USER_1'
          expect(current_path).to eq user_path(@user)
        end
      end
    end
  end
end
