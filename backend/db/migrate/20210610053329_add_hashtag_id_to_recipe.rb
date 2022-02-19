class AddHashtagIdToRecipe < ActiveRecord::Migration[6.0]
  def change
    add_reference :recipes, :hashtag, null: false, foreign_key: true
  end
end
