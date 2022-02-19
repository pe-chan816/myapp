class CreateTweetHashtagRelations < ActiveRecord::Migration[6.0]
  def change
    create_table :tweet_hashtag_relations do |t|
      t.references :tweet, index: true, foreign_key: true
      t.references :hashtag, index: true, foreign_key: true

      t.timestamps
    end
  end
end
