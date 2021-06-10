class AddPositionToRecipe < ActiveRecord::Migration[6.0]
  def change
    add_column :recipes, :position, :integer
  end
end
