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

  def self.create_with_uuid(uuid)
    # It's important that we do not validate as we're missing name and email.
    @user            = User.new
    @user.created_at = Time.now
    @user.uuid       = uuid
    @user.auth_token = SecureRandom.hex
    @user.save(:validate => false)

    return @user
  end
end
