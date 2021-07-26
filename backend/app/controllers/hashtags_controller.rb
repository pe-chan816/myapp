class HashtagsController < ApplicationController
  before_action :user_must_log_in, only:[:show, :index, :update_bar_info]

  def show
    ## hashtag ##
    hashtag = Hashtag.find_by(hashname: params[:word])

    ## tweets ##
    tweet_id = hashtag.tweet_ids
    base_data = Tweet.left_joins(:user,:hashtags)\
                     .select("tweets.*, users.name, users.profile_image, hashtags.hashname")\
                     .where(id: tweet_id)
                     .page(params[:page] ||= 1).per(15)
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
    tweets = array_data.uniq

    ## tweets_count ##
    all_data = Tweet.where(id: tweet_id)
    data_count = all_data.count

    ## recipes ##
    recipes = hashtag.recipes

    ## bar_info ##
    bar_info = hashtag.bars

    render json: { hashtag: hashtag,
                   tweets: tweets,
                   tweets_count: data_count,
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
