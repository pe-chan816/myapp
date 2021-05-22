class Tweet < ApplicationRecord
  belongs_to :user
  default_scope -> {order(created_at: :desc)}
  validates :user_id, presence: true
  validates :content, length:{maximum: 140}, presence: true

  # 画像投稿用にcarrierwaveをマウント
  mount_uploader :tweet_image, ImageUploader
end
