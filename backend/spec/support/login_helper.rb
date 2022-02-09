module LoginHelpers

  def login_as_testuser
    post login_url, params: { user: {
      email: "email@email.com",
      password: "password"
    }}
  end

  def login_as_admin
    post login_url, params: { user: {
      email: "admin@email.com",
      password: "password"
    }}
  end

=begin # system spec用
  def login_as_administrator
    visit login_path
    fill_in 'Email', with: 'admin@email.com'
    fill_in 'Password', with: 'password'
    click_on 'Login'
  end

  def login_as_testuser
    visit login_path
    fill_in 'Email', with: 'email@email.com'
    fill_in 'Password', with: 'password'
    click_on 'Login'
  end

  def login_as_testuser2
    visit login_path
    fill_in 'Email', with: 'email2@email.com'
    fill_in 'Password', with: 'password'
    click_on 'Login'
  end
=end
end
