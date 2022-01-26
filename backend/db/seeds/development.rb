# サンプルユーザー
30.times do |n|
  name = Faker::Name.unique.name
  unique_name = "unique#{n+1}"
  email = "email#{n+1}@email.com"
  password = "password"
  User.create!(
    name: name,
    unique_name: unique_name,
    email: email,
    password: password,
    password_confirmation: password
  )
end

# 管理ユーザー
User.create!(
  name: "Administrator",
  unique_name: "admin",
  email: "admin@email.com",
  password: "password",
  password_confirmation: "password",
  admin: true
)

# ゲストユーザー
User.create!(
  name: "ゲストユーザー",
  unique_name: "guest_user",
  email: "i_am_guest_user@email.com",
  password: "password",
  password_confirmation: "password",
  profile_image: open("#{Rails.root}/spec/fixtures/images/tuna_image.jpeg"),
  guest: true
)

# サンプルツイート（5ユーザー分）
users = User.order(:created_at).take(5)
40.times do
  content = Faker::Games::Pokemon.move
  users.each do |user|
    user.tweets.create!(content: content)
  end
end

# サンプルフォロー関係
users = User.all
user = User.first
following = users[2..20]
follower = users[10..25]
following.each {|followed| user.follow(followed)}
follower.each {|follower| follower.follow(user)}
