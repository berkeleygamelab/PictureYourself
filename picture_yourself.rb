
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
require "sinatra/cookies"
require "sinatra/activerecord"
require 'sinatra/flash'



#------------------------------------------------------------------------------
# Configuration
#--------------
set :port, 9393
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
require "./models/collage.rb"

#------------------------------------------------------------------------------
# Routes
#-------
require "./routes/user.rb"
require "./routes/parse.rb"
require "./routes/collage.rb"
require "./routes/apis.rb"



#------------------------------------------------------------------------------
# Filters
#--------
before do
  puts "request.cookies: #{request.cookies}"
  puts "Attempting login"
  puts "@current_user.blank? is #{@current_user.blank?}"
  puts "request.cookies['auth_token'].present? is #{request.cookies["auth_token"].present?}"
  if @current_user.blank? && request.cookies["auth_token"].present?
    @current_user = User.find_by_auth_token(request.cookies["auth_token"])

    puts "Is @current_user present? #{@current_user.present?}"

    response.set_cookie("auth_token", "") if @current_user.blank?
  end
end

#------------------------------------------------------------------------------
# Helper methods
#---------------

def login_user(user)
  response.set_cookie( "auth_token", (user.auth_token || SecureRandom.hex) )
  @current_user = user
end

def user_selfie_path(uuid)
  return "users/#{uuid}"
end

def user_self_file_path(uuid)
  return "#{settings.root}/public/" + user_self_path(uuid)
end

def collages_path
  return "collages"
end

def collages_file_path
  return "#{settings.root}/public/" + collages_path
end

def user_collage_path(uuid)
  return "collages/#{uuid}"
end

def user_collage_file_path(uuid)
  return "#{settings.root}/public/" + user_collage_path(uuid)
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
  puts "[/scenario] Inspecting @current_user: #{@current_user.inspect}"
  puts "Here is request.cookies['pyuserid'] = #{request.cookies["pyuserid"]}"
  # NOTE: If we're at this point, then let's go ahead and create the user only
  # if we don't have an existing user with the pyuserid.
  if @current_user.blank? && request.cookies["pyuserid"] && User.find_by_uuid(request.cookies["pyuserid"]).blank?
    # It's important that we do not validate as we're missing name and email.
    @user            = User.new
    @user.uuid       = request.cookies["pyuserid"]
    @user.auth_token = SecureRandom.hex
    @user.save(:validate => false)
    login_user(@user)
  end

  erb :scenario
end


#------------------------------------------------------------------------------
# GET /feed
#----------

get "/feed" do
  erb :feed
end

#------------------------------------------------------------------------------
# GET /career
#----------

get "/career" do
  erb :career
end

#------------------------------------------------------------------------------
# GET /stickers
#----------

get "/stickers" do
  cookies[:career] = params[:career] if params[:career].present?

  # TODO: Render the stickers appropriate for this career.
  erb :stickers
end

#------------------------------------------------------------------------------
# GET /comic
#----------

get "/comic" do
  erb :comic
end

#------------------------------------------------------------------------------


get "/selfie" do
  "users/#{request.cookies["pyuserid"]}/1_sticker.png"
end
