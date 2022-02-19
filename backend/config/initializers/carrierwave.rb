CarrierWave.configure do |config|
  if Rails.env.production?
    config.storage :fog
    config.fog_provider = 'fog/aws'
    config.fog_directory = 'insyutagram-bucket20210828'
    config.fog_credentials = {
      provider: 'AWS',
      aws_access_key_id: ENV['S3_KEY_ID'],
      aws_secret_access_key: ENV['S3_SECRET_KEY'],
      region: 'ap-northeast-1'
    }
  end
end
