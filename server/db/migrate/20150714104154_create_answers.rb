class CreateAnswers < ActiveRecord::Migration
  def change
    create_table :answers do |t|
      t.string :word
      t.integer :user_id
      t.integer :location_id

      t.timestamps null: false
    end
  end
end
