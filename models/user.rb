class User < ActiveRecord::Base
  # attr_accessible :email, :password_digest, :name
  validates :email,           :presence => true
  validates :password_digest, :presence => true
  validates :name,            :presence => true

  has_many :collages
  has_many :comic_strips

  def collage_file_paths
    return self.collages.map {|c| "#{settings.root}/public/collages/#{self.uuid}/#{c.file_name}"}
  end
end
