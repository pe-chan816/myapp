FactoryBot.define do
  factory :relationship do
    association :follower, factory: :testuser
    association :followed, factory: :testuser2
  end
end
