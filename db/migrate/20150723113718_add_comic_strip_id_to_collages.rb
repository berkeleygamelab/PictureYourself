class AddComicStripIdToCollages < ActiveRecord::Migration
  def change
    add_column :collages, :comic_strip_id, :integer
  end
end
