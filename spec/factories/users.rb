FactoryBot.define do
  factory :testuser, class: User do
    name { "TEST_USER_1" }
    email { "email@email.com" }
    password { "password" }
    password_confirmation { "password" }
  end
end
