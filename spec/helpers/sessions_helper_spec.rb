require 'rails_helper'

RSpec.describe "SessionsHelper", type: :helper do
  include SessionsHelper
  let(:user) { FactoryBot.create(:testuser) }

  describe "login(user) メソッド" do
    it "正常な処理が行われている" do
      log_in user
      def result
        session[:user_id] == user.id
      end
      expect(result).to eq true
    end
  end

  describe "remember(user) メソッド" do
    before do
      remember user
    end

    it "cookies.permanent.signed[:user_id] と user.id が正しく一致する" do
      def result
        cookies.permanent.signed[:user_id] == user.id
      end
      expect(result).to eq true
    end
    it "cookies.permanent[:remember_token] と user.remember_token が正しく一致する" do
      def result
        cookies.permanent[:remember_token] == user.remember_token
      end
      expect(result).to eq true
    end
  end

  describe "forget(user) メソッド" do
    before do
      log_in user
      remember user
      forget user
    end

    it "cookies[:user_id] の中身が空になる" do
      expect(cookies.permanent.signed[:user_id].nil?).to eq true
    end
    it "cookies[:remember_token] の中身が空になる" do
      expect(cookies.permanent[:remember_token].nil?).to eq true
    end
  end

  describe "current_user メソッド" do
    context "session[:user_id] が存在している場合" do
      it "current_user が定義される" do
        log_in user
        cookies.signed[:user_id] = nil
        expect(current_user.present?).to eq true
      end
    end
    context "cookies.signed[:user_id] が存在している場合" do
      it "current_user が定義される" do
        remember user
        session[:user_id] = nil
        expect(current_user.present?).to eq true
      end
    end
  end

  describe "logged_in? メソッド" do
    context "session[:user_id] に値が入っている場合" do
      before do
        log_in user
      end
      it "current_user に値が入っていれば true を返す" do
        expect(logged_in?).to eq true
      end
      it "current_user に値が入っていなければ false を返す" do
        # session[:user_id]に値が残っていると current_user に値が入ってしまうので消す
        session[:user_id] = nil
        current_user = nil
        expect(logged_in?).to eq false
      end
    end
    context "cookies.signed[:user_id] に値が入っている場合" do
      before do
        remember user
      end
      it "current_user に値が入っていれば true を返す" do
        expect(logged_in?).to eq true
      end
      it "current_user に値が入っていなければ false を返す" do
        # cookies.signed[:user_id]に値が残っていると current_user に値が入ってしまうので消す
        cookies.signed[:user_id] = nil
        current_user = nil
        expect(logged_in?).to eq false
      end
    end
  end

  describe "log_out メソッド" do
    before do
      log_in user
      remember user
      log_out
    end

    it "session[:user_id] の中身が空になる" do
      expect(session[:user_id].blank?).to eq true
    end
    it "current_user の中身が空になる" do
      expect(current_user.nil?).to eq true
    end
  end
end
