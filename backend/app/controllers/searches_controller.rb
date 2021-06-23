class SearchesController < ApplicationController
  def search
    @keyword = params[:search_word]
    @searched_tweet = Tweet.where("content LIKE ?", "%#{@keyword}%")
    @searched_user = User.where("name LIKE ?", "%#{@keyword}%")
  end
end
