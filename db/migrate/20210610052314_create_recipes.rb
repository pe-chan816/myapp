class CreateRecipes < ActiveRecord::Migration[6.0]
  def change
    create_table :recipes do |t|
      t.string :material
      t.integer :amount
      t.string :unit

      t.timestamps
    end
  end
end
