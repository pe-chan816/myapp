FactoryBot.define do
  factory :adminuser, class: User do
    name { "ADMIN_USER" }
    email { "admin@email.com" }
    password { "password" }
    password_confirmation { "password" }
    admin { true }
  end

  factory :testuser, class: User do
    name { "TEST_USER_1" }
    email { "email@email.com" }
    password { "password" }
    password_confirmation { "password" }

    after(:create) do |testuser|
      30.times do |n|
        testuser.tweets.create(content: "This is No.#{n+1} message.")
      end
    end
  end

  factory :testuser2, class: User do
    name { "TEST_USER_2" }
    email { "email2@email.com" }
    password { "password" }
    password_confirmation { "password" }
  end

  factory :testuser3, class: User do
    name { "TEST_USER_3" }
    email { "email3@email.com" }
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
