class Hashtag < ApplicationRecord
  validates :hashname, presence: true, length: {maximum: 99}
  has_many :tweet_hashtag_relations
  has_many :tweets, through: :tweet_hashtag_relations
end
