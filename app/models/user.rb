class User < ApplicationRecord
  before_save {self.email.downcase!}
  require 'digest/md5'
  attr_accessor :remember_token

  # name のバリデーション
  validates :name, presence: true, length:{maximum: 30}

  # email のバリデーション
  VALID_EMAIL_REGEX = /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length:{maximum: 255},
                    format: {with: VALID_EMAIL_REGEX},
                    uniqueness: {case_sensitive: false}

  # password のバリデーション
  has_secure_password
  validates :password, length: {minimum: 8}, allow_nil: true

  # 永続セッション用のトークン生成
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  # ハッシュ値化する
  def User.remember_digest(token)
    Digest::MD5.hexdigest(token)
  end

  # 永続セッション用トークンをハッシュ値化して :remember_digest に保存する
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.remember_digest(remember_token))
  end

  # :remember_digest の中身を消去する
  def forget
    update_attribute(:remember_digest, nil)
  end

  # 渡された token をハッシュ値化したものが :remember_digest と一致したら true を返す
  def authenticated?(remember_token)
    return false if remember_digest.nil?
    remember_digest == User.remember_digest(remember_token)
  end
end
