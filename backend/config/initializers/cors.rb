Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:8000', 'http://localhost', 'http://ec2-54-178-131-216.ap-northeast-1.compute.amazonaws.com'
    resource '*',
      headers: :any,
      credentials: true,
      methods: [:get, :post, :patch, :put, :delete, :options, :head]
  end
end
