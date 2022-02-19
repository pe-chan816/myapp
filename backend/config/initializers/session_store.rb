if Rails.env === "production"
  Rails.application.config.session_store :cookie_store, key: "_myapp_session" #, domain:"フロントエンドのドメイン名"
else
  Rails.application.config.session_store :cookie_store, key: "_myapp_session"
end
