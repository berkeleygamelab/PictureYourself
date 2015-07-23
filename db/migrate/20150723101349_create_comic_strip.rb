class CreateComicStrip < ActiveRecord::Migration
  def change
    create_table :comic_strips do |t|
      t.integer  :user_id
      t.string   :title
      t.datetime :finished_at
    end

    create_table :comic_strip_orderings do |t|
      t.integer :comic_strip_id
      t.integer :collage_id
      t.integer :position
    end
  end
end
