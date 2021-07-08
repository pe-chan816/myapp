class HashtagsController < ApplicationController
  before_action :user_must_log_in, only:[:show, :index, :update_bar_info]

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

  def update_bar_info
    hashtag = Hashtag.find_by(hashname: params[:word])
    if hashtag.latlngs.exists? # すでに情報がある場合の処理
      bar_info = hashtag.latlngs.first
      bar_info.update_attributes(bar_params)
      render json: {result: bar_info}
    else # 初めての時の処理
      new_bar_info = hashtag.latlngs.create(bar_params)
      render json: {result: new_bar_info}
    end
  end

  def update_recipe
    hashtag = Hashtag.find_by(hashname: params[:word])
    hashtag.recipes.create(recipe_params)
    render json: { recipes: hashtag.recipes }
  end

  def destroy_recipe
    recipe = Recipe.find(params[:id])
    new_recipe = recipe.hashtag.recipes
    recipe.destroy
    render json: { messages: "レシピ削除完了",
                   new_recipe: new_recipe }
  end

  private
    def bar_params
      params.require(:latlng).permit(:lat, :lng)
    end

    def recipe_params
      params.require(:recipe).permit(:material, :amount, :unit, :position)
    end

end
