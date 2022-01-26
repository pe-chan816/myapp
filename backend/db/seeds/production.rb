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
  guest: true
)
