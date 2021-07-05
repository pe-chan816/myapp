class CreateLatlngs < ActiveRecord::Migration[6.0]
  def change
    create_table :latlngs do |t|
      t.float :lat
      t.float :lng
      t.references :hashtag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
