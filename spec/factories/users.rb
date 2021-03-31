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
  factory :users, class: User do
    sequence :name do |n|
      "FAKE_USER#{n}"
    end
    sequence :email do |n|
      "email#{n}@fake-email.com"
    end
    password { "password" }
    password_confirmation { "password" }
  end
end
