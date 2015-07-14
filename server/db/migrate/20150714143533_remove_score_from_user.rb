class RemoveScoreFromUser < ActiveRecord::Migration
  def change
    remove_column :users, :score, :integer, :default => 0
  end
end
