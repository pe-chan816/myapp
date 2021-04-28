FactoryBot.define do
  factory :tweet do
    content { "TestTweet" }
    association :user, factory: :testuser
  end
end
