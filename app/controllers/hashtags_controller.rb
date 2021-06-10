class HashtagsController < ApplicationController
  before_action :user_must_log_in, only:[:show, :index, :edit, :update]

  def show
    @hashtag = Hashtag.find_by(hashname: params[:word])
    @recipes = @hashtag.recipes
    @tweets = @hashtag.tweets
    gon.hashtag_lat = @hashtag.lat.to_f # float型でカラム設計しても結局to_fを外せず、座標の都合上string型に
    gon.hashtag_lng = @hashtag.lng.to_f # 同上
  end

  def index
    @hashtags = Hashtag.all
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

  private
    def hashtag_params
      params.require(:hashtag).permit(:lat, :lng, recipes_attributes:[:id, :material, :amount, :unit, :_destroy])
    end

end
