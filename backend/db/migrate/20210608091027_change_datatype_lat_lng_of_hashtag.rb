class ChangeDatatypeLatLngOfHashtag < ActiveRecord::Migration[6.0]
  def change
    change_column :hashtags, :lat, :string
    change_column :hashtags, :lng, :string
  end
end
