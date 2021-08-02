class User < ApplicationRecord
  has_many :tweets, dependent: :destroy

  has_many :active_relationships, class_name: "Relationship",
                                  foreign_key: "follower_id",
                                  dependent: :destroy
  has_many :following, through: :active_relationships, source: :followed

  has_many :passive_relationships, class_name: "Relationship",
                                   foreign_key: "followed_id",
                                   dependent: :destroy
  has_many :followers, through: :passive_relationships, source: :follower

  has_many :favorites, dependent: :destroy
  has_many :favorite_tweets, through: :favorites, source: :tweet

  before_save {self.email.downcase!}

  # ハッシュ値化用の下準備
  require 'digest/md5'

  # セッション管理用の下準備
  attr_accessor :remember_token

  # 画像投稿用にcarrierwaveをマウント
  mount_uploader :profile_image, ImageUploader

  # name のバリデーション
  validates :name, presence: true, length:{maximum: 30}

  # email のバリデーション
  VALID_EMAIL_REGEX = /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true,
                    length:{maximum: 255},
                    format: {with: VALID_EMAIL_REGEX},
                    uniqueness: {case_sensitive: false}

  # password のバリデーション
  has_secure_password
  validates :password, length: {minimum: 8}, allow_nil: true

  # self_introduction バリデーション
  validates :self_introduction, length: {maximum: 160}

  # unique_name のバリデーション
  validates :unique_name, presence: true,
                          length: {maximum: 30},
                          uniqueness: true

  # 永続セッション用のトークン生成
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  # ハッシュ値化する
  def User.remember_digest(token)
    Digest::MD5.hexdigest(token)
  end

  # unique_name の初期値作成
  def create_unique_name
    self.unique_name = SecureRandom.base64(9)
  end

  # 永続セッション用トークンをハッシュ値化して :remember_digest に保存する
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.remember_digest(remember_token))
  end

  # :remember_digest の中身を消去する
  def forget
    update_attribute(:remember_digest, nil)
  end

  # 渡された token をハッシュ値化したものが :remember_digest と一致したら true を返す
  def authenticated?(remember_token)
    return false if remember_digest.nil?
    remember_digest == User.remember_digest(remember_token)
  end

  # タイムライン表示用
  def timeline
    id = User.where(id: self.id).or(User.where(id: self.following_ids))
    Tweet.where(user_id: id)
  end

  # ユーザーをフォロー
  def follow(other_user)
    self.following << other_user
  end

  # ユーザーをアンフォロー
  def unfollow(other_user)
    self.active_relationships.find_by(followed_id: other_user.id).destroy
  end

  # 他ユーザーをフォローしているか確認する
  def following?(other_user)
    self.following.include?(other_user)
  end

  # いいねしているツイートの取得
  def favorited_tweets
    id = self.favorite_tweets.ids
    Tweet.where(id: id)
  end
end
