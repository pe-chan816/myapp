class AddTweetImageToTweets < ActiveRecord::Migration[6.0]
  def change
    add_column :tweets, :tweet_image, :string
  end
end
