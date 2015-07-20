class Collage < ActiveRecord::Base
  # attr_accessible :email, :password_digest, :name
  validates :title,   :presence => true
  validates :user_id, :presence => true

  belongs_to :user
end
