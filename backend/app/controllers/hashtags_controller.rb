class HashtagsController < ApplicationController
  before_action :user_must_log_in, only:[:show, :index, :edit, :update]

  def show
    hashtag = Hashtag.find_by(hashname: params[:word])

    tweet_id = hashtag.tweet_ids
    base_data = Tweet.joins(:user).select("tweets.*, users.name, users.profile_image").where(id: tweet_id)
    tweets = []
    base_data.each do |d|
      user = User.find(d.user_id)
      d.profile_image = user.profile_image
      tweets.push(d)
    end

    recipes = hashtag.recipes

    latlng = hashtag.latlngs

    render json: { hashtag: hashtag,
                   tweets: tweets,
                   recipes: recipes,
                   latlng: latlng }
  end

  def index
    data = []
    hashtags = Hashtag.all
    hashtags.each do |h|
      count = h.tweets.count
      new_h = h.attributes.merge("count" => count)
      data.push(new_h)
    end
    render json: {hashtags: data}
  end

  def edit
    @hashtag = Hashtag.find(params[:id])
    @hashtag.recipes.build
  end

  def update
    @hashtag = Hashtag.find(params[:id])
    if params[:latlng]
      latlng = params[:latlng].delete("()").split(", ")
      @hashtag.update_attributes(lat: latlng[0], lng: latlng[1])
      flash[:notice] = "マップ編集完了"
      redirect_to "/hashtag/#{@hashtag.hashname}"
    elsif @hashtag.update_attributes(hashtag_params)
      flash[:notice] = "レシピ編集完了"
      redirect_to "/hashtag/#{@hashtag.hashname}"
    else
      flash[:notice] = "タグ編集はキャンセルされました"
      redirect_to "/hashtag/#{@hashtag.hashname}"
    end
  end

  def update_bar_info
    hashtag = Hashtag.find_by(hashname: params[:word])
    if hashtag.latlngs.exists?
      # すでに情報がある場合の処理
      bar_info = hashtag.latlngs.first
      bar_info.update_attributes(bar_params)
      render json: {result: bar_info}
    else
      # 初めての処理
      new_bar_info = hashtag.latlngs.create(bar_params)
      render json: {result: new_bar_info}
    end
  end

  private
    def hashtag_params
      params.require(:hashtag).permit(:lat, :lng, recipes_attributes:[:id, :material, :amount, :unit, :_destroy])
    end

    def bar_params
      params.require(:latlng).permit(:lat, :lng)
    end

end
