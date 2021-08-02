class TweetsController < ApplicationController
  before_action :user_must_log_in, only:[:create, :destroy]
  before_action :correct_user, only:[:destroy]

  def create
    tweet = current_user.tweets.build(tweet_params)
    recieved_tag = params[:hashtag]
    hashtag = recieved_tag.split(/,/) #受け取った:hashtagはstringなので配列に直す

    if tweet.save
      hashtag.uniq.map do |h| #すでにタグがあるかどうかを確認しつつリレーションシップを結んでいく
        tag = Hashtag.find_or_create_by(hashname: h.downcase)
        tweet.hashtags << tag
      end
    end
  end

  def destroy
    @tweet.destroy
    render json: {message: "ツイート削除"}
  end

  def show
##
    tweet = Tweet.find(params[:id])
    base_data = Tweet.left_joins(:user,:hashtags)
                     .select("tweets.*,
                              users.name, users.profile_image, users.unique_name,
                              hashtags.hashname")
                     .where("tweets.id = ?", tweet.id)
    array_data = []
    base_data.each do |d|
      user = User.find(d.user_id)
      tweet = Tweet.find(d.id)
      d.profile_image = user.profile_image
      d.hashname = d.hashtags
      ##############
      new_d = d.attributes.merge("favorite_count" => d.favorites.count,
                                 "fav_or_not" => d.favorited?(current_user))
      new_d2 = new_d.merge("tweet_image" => tweet.tweet_image,
                           "created_at" => tweet.created_at.strftime("%-H:%M %Y/%m/%d"))
      ##############
      array_data.push(new_d2)
    end
    data = array_data.uniq
##
    favorite_count = tweet.favorites.count
    favorite_or_not = tweet.favorited?(current_user)
    render json: {tweet: data,
                  favorite_count: favorite_count,
                  favorite_or_not: favorite_or_not}
  end

  def favorite
    tweet = Tweet.find(params[:id])
    favorited_users = tweet.user_favorited
    favorite_count = favorited_users.count

    render json: {favorited_users: favorited_users,
                  favorite_count: favorite_count}
  end

  private
  def tweet_params
    params.require(:tweet).permit(:content, :tweet_image)
  end

  def correct_user
    @tweet = current_user.tweets.find(params[:id])
    if @tweet.nil?
      flash[:danger] = "ツイートがありません"
      redirect_to root_path
    end
  end
end
