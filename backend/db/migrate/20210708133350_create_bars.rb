class CreateBars < ActiveRecord::Migration[6.0]
  def change
    create_table :bars do |t|
      t.string :address
      t.string :name
      t.string :phone_number
      t.references :hashtag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
