FactoryBot.define do
  factory :testuser, class: User do
    name { "TEST_USER_1" }
    email { "email@email.com" }
    password { "password" }
    password_confirmation { "password" }
  end
  factory :testuser2, class: User do
    name { "TEST_USER_2" }
    email { "email2@email.com" }
    password { "password" }
    password_confirmation { "password" }
  end
end
