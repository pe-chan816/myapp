class HashtagsController < ApplicationController
  before_action :user_must_log_in, only:[:show, :index, :edit, :update]

  def show
    @hashtag = Hashtag.find_by(hashname: params[:word])
    @tweets = @hashtag.tweets
    gon.hashtag_lat = @hashtag.lat.to_f # float型でカラム設計しても結局to_fを外せず、座標の都合上string型に
    gon.hashtag_lng = @hashtag.lng.to_f # 同上
  end

  def index
    @hashtags = Hashtag.all
  end

  def edit
    @hashtag = Hashtag.find(params[:id])
  end

  def update
    @hashtag = Hashtag.find(params[:id])
    latlng = params[:latlng].delete("()").split(", ")
    if @hashtag.update_attributes(lat: latlng[0], lng: latlng[1])
      flash[:notice] = "タグ編集成功"
      redirect_to "/hashtag/#{@hashtag.hashname}"
    end
  end
end
