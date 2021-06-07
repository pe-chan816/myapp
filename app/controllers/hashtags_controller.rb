class HashtagsController < ApplicationController
  def show
    @hashtag = Hashtag.find_by(hashname: params[:word])
    @tweets = @hashtag.tweets
  end

  def index
    @hashtags = Hashtag.all
  end
end
