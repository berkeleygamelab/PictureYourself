class CreateCollages < ActiveRecord::Migration
  def change
    create_table :collages do |t|
      t.string  :title
      t.string  :description
      t.integer :user_id
      t.string  :file_name
    end
  end
end
