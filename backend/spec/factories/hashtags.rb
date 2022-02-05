FactoryBot.define do
  factory :tag , class: Hashtag do
    hashname { "テストタグ" }
  end

  factory :gin_tonic, class: Hashtag do
    hashname { "ジントニック" }

    after(:create) do |tag|
      tag.recipes.create(
        material: "ジン",
        amount: 45,
        unit: "ml"
      )
      tag.recipes.create(
        material: "トニックウォーター",
        amount: nil,
        unit: "適量"
      )
    end
  end

  factory :tender , class: Hashtag do
    hashname { "テンダー" }

    after(:create) do |tag|
      tag.bars.create(
        address: "東京都中央区銀座6-5-16 三楽ビル 9F",
        name: "銀座 テンダー",
        phone_number: "03-3571-8343",
        lat: 35.67133978135633,
        lng: 139.76214918404906
      )
    end
  end
end
