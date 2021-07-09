class AddLatLngToBar < ActiveRecord::Migration[6.0]
  def change
    add_column :bars, :lat, :float
    add_column :bars, :lng, :float
  end
end
