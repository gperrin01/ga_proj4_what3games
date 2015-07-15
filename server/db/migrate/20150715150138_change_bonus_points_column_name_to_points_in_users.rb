class ChangeBonusPointsColumnNameToPointsInUsers < ActiveRecord::Migration
  def change
    rename_column :users, :bonus_points, :points
  end
end
