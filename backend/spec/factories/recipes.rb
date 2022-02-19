FactoryBot.define do
  factory :gin, class: User do
    material { "ジン" }
    amount { 45 }
    unit { "ml" }
  end

  factory :tonic, class: User do
    material { "トニックウォーター" }
    amount { nil }
    unit { "適量" }
  end
end
