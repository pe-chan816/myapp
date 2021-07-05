class RemoveLatLngFromHashtags < ActiveRecord::Migration[6.0]
  def change
    remove_column :hashtags, :lat, :string
    remove_column :hashtags, :lng, :string
  end
end
