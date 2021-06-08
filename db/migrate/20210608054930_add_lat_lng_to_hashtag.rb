class AddLatLngToHashtag < ActiveRecord::Migration[6.0]
  def change
    add_column :hashtags, :lat, :string
    add_column :hashtags, :lng, :string
  end
end
