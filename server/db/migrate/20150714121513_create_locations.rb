class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :three_words, null: false

      t.timestamps null: false
    end
  end
end
