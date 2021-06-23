class TweetHashtagRelation < ApplicationRecord
  belongs_to :hashtag
  belongs_to :tweet
  validates :hashtag_id, presence: true
  validates :tweet_id, presence: true
end
