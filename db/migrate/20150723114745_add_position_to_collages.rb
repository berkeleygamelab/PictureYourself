class AddPositionToCollages < ActiveRecord::Migration
  def change
    add_column :collages, :position, :integer

    drop_table :comic_strip_orderings
  end
end
