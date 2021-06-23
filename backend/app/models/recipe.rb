class Recipe < ApplicationRecord
  belongs_to :hashtag
  acts_as_list scope: :hashtag
end
