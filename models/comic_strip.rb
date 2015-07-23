class ComicStrip < ActiveRecord::Base
  validates :user_id, :presence => true

  has_many :collages
  belongs_to :user
end
