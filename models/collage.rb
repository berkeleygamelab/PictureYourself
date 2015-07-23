class Collage < ActiveRecord::Base
  # attr_accessible :email, :password_digest, :name
  # validates :title,   :presence => true
  validates :user_id, :presence => true

  belongs_to :user

  def file_path
    u = User.find_by_id(self.user_id)
    return "collages/#{u.uuid}/#{self.file_name}"
  end
end
