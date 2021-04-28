30.times do |n|
  name = Faker::Name.unique.name
  email = "email#{n+1}@email.com"
  password = "password"
  User.create!(
    name: name,
    email: email,
    password: password,
    password_confirmation: password
  )
end

User.create!(
  name: "Administrator",
  email: "admin@email.com",
  password: "password",
  password_confirmation: "password",
  admin: true
)

users = User.order(:created_at).take(5)
40.times do
  content = Faker::Games::Pokemon.move
  users.each do |user|
    user.tweets.create!(content: content)
  end
end
