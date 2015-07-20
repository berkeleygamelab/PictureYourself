class User < ActiveRecord::Base
  # attr_accessible :email, :password_digest, :name
  validates :email,           :presence => true
  validates :password_digest, :presence => true
  validates :name,            :presence => true
end
