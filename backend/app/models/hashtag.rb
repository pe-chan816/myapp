class Hashtag < ApplicationRecord
  validates :hashname, presence: true,
                       length: {maximum: 99},
                       uniqueness: {case_sensitive: false}

  has_many :tweet_hashtag_relations, dependent: :destroy
  has_many :tweets, through: :tweet_hashtag_relations

  has_many :bars, dependent: :destroy

  has_many :recipes, -> {order(position: :asc)}, inverse_of: :hashtag
  accepts_nested_attributes_for :recipes, reject_if: :all_blank, allow_destroy: true
end
