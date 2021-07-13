class HashtagsController < ApplicationController
  before_action :user_must_log_in, only:[:show, :index, :update_bar_info]

  def show
    hashtag = Hashtag.find_by(hashname: params[:word])

    tweet_id = hashtag.tweet_ids
    base_data = Tweet.left_joins(:user,:hashtags)\
                     .select("tweets.*, users.name, users.profile_image, hashtags.hashname")\
                     .where(id: tweet_id)
    array_data = []
    base_data.each do |d|
      user = User.find(d.user_id)
      d.profile_image = user.profile_image
      d.hashname = d.hashtags
      array_data.push(d)
    end
    tweets = array_data.uniq
=begin
    tweet_id = hashtag.tweet_ids
    base_data = Tweet.joins(:user).select("tweets.*, users.name, users.profile_image").where(id: tweet_id)
    tweets = []
    base_data.each do |d|
      user = User.find(d.user_id)
      d.profile_image = user.profile_image
      tweets.push(d)
    end
=end
    recipes = hashtag.recipes

    bar_info = hashtag.bars

    render json: { hashtag: hashtag,
                   tweets: tweets,
                   recipes: recipes,
                   bar_info: bar_info }
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
    hashtag.bars.each do |b| # undefinedの部分がダブって登録されるので一旦クリアする
      b.destroy
    end
    new_bar_info = hashtag.bars.create(bar_params)

    hashtag.recipes.each do |r| # マップとレシピは両立しないので削除
      r.destroy
    end

    render json: {result: new_bar_info}
  end

  def update_recipe
    hashtag = Hashtag.find_by(hashname: params[:word])
    hashtag.recipes.create(recipe_params)

    hashtag.bars.each do |b| # マップとレシピは両立しないので削除
      b.destroy
    end

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
      params.require(:bar).permit(:name, :address, :phone_number, :lat, :lng)
    end

    def recipe_params
      params.require(:recipe).permit(:material, :amount, :unit, :position)
    end

end
