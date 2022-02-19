FactoryBot.define do
  factory :relationship do
    association :follower, factory: :testuser
    association :followed, factory: :testuser2
    followed_id { User.find_by( unique_name: "test2" ).id }
    follower_id { User.find_by( unique_name: "test1" ).id }
  end
end
