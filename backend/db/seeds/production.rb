# 管理ユーザー
User.create!(
  name: "Administrator",
  email: "admin@email.com",
  password: "password",
  password_confirmation: "password",
  admin: true
)

# ゲストユーザー
User.create!(
  name: "ゲストユーザー",
  email: "i_am_guest_user@email.com",
  password: "password",
  password_confirmation: "password",
  profile_image: open("#{Rails.root}/spec/fixtures/images/tuna_image.jpeg"),
  guest: true
)
