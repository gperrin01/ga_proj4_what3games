class CreateJourneys < ActiveRecord::Migration
  def change
    create_table :journeys do |t|
      t.integer :start_location_id
      t.integer :end_location_id
      t.integer :bonus_points

      t.timestamps null: false
    end
  end
end
