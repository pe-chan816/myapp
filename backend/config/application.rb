require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MyappTest
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0
    config.time_zone = 'Tokyo'
    # 認証トークンをremoteフォームに埋め込む（ブラウザ側でjavascriptが無効の場合の対策）
    config.action_view.embed_authenticity_token_in_remote_forms = true

    config.generators do |g|
      g.template_engine :slim
      g.test_framework :rspec,
                        view_specs: false,
                        helper_specs: false
    end
  end
end
