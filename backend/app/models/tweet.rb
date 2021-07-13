class Tweet < ApplicationRecord
  belongs_to :user

  default_scope -> {order(created_at: :desc)}
  validates :user_id, presence: true
  validates :content, length:{maximum: 140}, presence: true

  has_many :favorites, dependent: :destroy
  has_many :user_favorited, through: :favorites, source: :user

  has_many :tweet_hashtag_relations, dependent: :destroy
  has_many :hashtags, through: :tweet_hashtag_relations

  # 画像投稿用にcarrierwaveをマウント
  mount_uploader :tweet_image, ImageUploader

  def favorited?(user)
    self.favorites.where(user_id: user.id).exists?
  end

=begin
  #  ツイート中にハッシュタグは埋めないことになったので不要
  after_create do
    tweet = Tweet.find(self.id)
    hashtag = self.content.scan(/[#＃][\w\p{Han}ぁ-ヶｦ-ﾟー]+/)
    hashtag.uniq.map do |h|
      tag = Hashtag.find_or_create_by(hashname: h.downcase.delete('#'))
      tweet.hashtags << tag
    end
  end

  # ツイート編集できる場合はこちらも
  before_before do
    tweet = Tweet.find(self.id)
    tweet.hashtags.clear
    hashtag = self.content.scan(/[#＃][\w\p{Han}ぁ-ヶｦ-ﾟー]+/)
    hashtag.uniq.map do |h|
      tag = Hashtag.find_or_create_by(hashname: h.downcase.delete('#'))
      tweet.hashtags << tag
    end
  end
=end
end
