class AddTimestampToCollages < ActiveRecord::Migration
  def change
    add_column :collages, :created_at, :datetime
    add_column :users, :created_at, :datetime
    add_column :comic_strips, :created_at, :datetime
  end
end
