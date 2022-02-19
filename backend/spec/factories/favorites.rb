FactoryBot.define do
  factory :favorite do
    association :user, factory: :testuser2
    tweet_id {Tweet.first.id}
  end
end
