class ComicStrip < ActiveRecord::Base
  validates :user_id, :presence => true

  has_many :collages, :dependent => :destroy
  belongs_to :user
end
