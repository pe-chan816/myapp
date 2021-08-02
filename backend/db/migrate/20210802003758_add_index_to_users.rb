class AddIndexToUsers < ActiveRecord::Migration[6.0]
  def change
    add_index :users, :unique_name, unique: true
  end
end
