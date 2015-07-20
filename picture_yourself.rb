
#------------------------------------------------------------------------------
# Libraries
#----------
require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'
require 'json'
require 'mail'
require 'fileutils'
require "sinatra/activerecord"
require 'sinatra/flash'



#------------------------------------------------------------------------------
# Configuration
#--------------
set :port, 80
set :bind, '128.32.189.148'
#trying to lock threads to avoid not receiving requests
set :lock, true
set :server, 'thin'
set :database_file, "database.yml"

#mail Settings
domain = ENV["RAILS_HOST"] || 'py-bcnm.berkeley.edu'
options = { :address              => "smtp.gmail.com",
            :port                 => 587,
            :domain               => domain,
            :user_name            => 'picyourfuture',
            :password             => 'Py12ab21yP',
            :authentication       => 'plain',
            :enable_starttls_auto => true  }

enable :sessions


Mail.defaults do
  delivery_method :smtp, options
end


#------------------------------------------------------------------------------
# App-specific models
#--------------------
require "./models/user.rb"

#------------------------------------------------------------------------------
# Routes
#-------
require "./routes/user.rb"
require "./routes/parse.rb"
require "./routes/apis.rb"
require "./routes/email.rb"


#------------------------------------------------------------------------------
# Filters
#--------
before do
  if @current_user.blank? && session[:auth_token].present?
    @current_user = User.find_by_auth_token(session[:auth_token])
    session[:auth_token] = nil if @current_user.blank?
  end
end

#------------------------------------------------------------------------------
# Helper methods
#---------------

def login_user(user)
  session[:auth_token] = user.auth_token
  @current_user        = user
end

def user_selfie_path(uuid)
  return "#{settings.root}/users/#{uuid}"
end

def collages_path
  return "#{settings.root}/public/collages"
end

def user_collage_path(uuid)
  return collages_path + "/uuid"
end


#------------------------------------------------------------------------------
# GET /
#---------

get '/' do
  cookie = request.cookies["pyuserid"]

  # Check if cookie exits, if it does delete pictures associated with cookie
  # TODO: We don't want to be deleting these directories.
  # unless cookie.nil?
  #   name = 'public/users/' + cookie
  #   FileUtils.rm_rf(Dir.glob(name))
  # end
  # FileUtils.rm_rf(Dir.glob('uploads/*'))

  erb :index
end


#------------------------------------------------------------------------------
# GET /tos
#---------

get "/tos" do
  erb :tos
end

#------------------------------------------------------------------------------
# GET /camera
#---------

get "/camera" do
  erb :camera
end

#------------------------------------------------------------------------------
# GET /background
#---------

get "/background" do
  erb :background
end

#------------------------------------------------------------------------------
# GET /scenario
#---------

get "/scenario" do
  erb :scenario
end

get "/selfie" do
  "users/#{request.cookies["pyuserid"]}/1_sticker.png"
end
