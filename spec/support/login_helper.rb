module LoginHelpers
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
end
