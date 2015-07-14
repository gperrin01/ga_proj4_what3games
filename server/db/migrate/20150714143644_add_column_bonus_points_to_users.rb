class AddColumnBonusPointsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :bonus_points, :integer, :default => 0
  end
end
