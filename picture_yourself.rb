
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

use Rack::Logger

helpers do
  def logger
    request.logger
  end
end

#------------------------------------------------------------------------------
# Configuration
#--------------
set :port, 9393
set :lock, true
set :server, 'thin'
set :database_file, "database.yml"


# Load environment variables specified in .env
require 'dotenv'
Dotenv.load

#mail Settings
domain = ENV["RAILS_HOST"] || 'py-bcnm.berkeley.edu'
options = { :address              => "smtp.gmail.com",
            :port                 => 587,
            :domain               => domain,
            :user_name            => ENV["GMAIL_USERNAME"],
            :password             => ENV["GMAIL_PASSWORD"],
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
require "./models/comic_strip.rb"

#------------------------------------------------------------------------------
# Routes
#-------
require "./routes/user.rb"
require "./routes/parse.rb"
require "./routes/collage.rb"
require "./routes/apis.rb"
require "./routes/career.rb"
require "./routes/comic.rb"



#------------------------------------------------------------------------------
# Filters
#--------
before do
  if request.cookies["auth_token"].present?
    @current_user = User.find_by_auth_token(request.cookies["auth_token"])

    # If we couldn't find the user for this auth token, then this token is no longer
    # synced with database. Let's remove it.
    response.set_cookie("auth_token", "") if @current_user.blank?
  end
end

#------------------------------------------------------------------------------
# Helper methods
#---------------


def login(user)
  user.update_column(:auth_token, SecureRandom.hex)  if user.auth_token.blank?
  response.set_cookie( "auth_token", user.reload.auth_token)
  @current_user = user
end

def logout
  @current_user = nil
  response.set_cookie("auth_token", "")
end

def user_selfie_path(uuid)
  return "users/#{uuid}"
end

def user_selfie_file_path(uuid)
  return "#{settings.root}/public/" + user_selfie_path(uuid)
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
#--------------

get "/scenario" do
  # NOTE: If we're at this point, then let's go ahead and create the user only
  # if we don't have an existing user with the pyuserid.
  @user = User.find_by_uuid(request.cookies["pyuserid"])
  @user = User.create_with_uuid(request.cookies["pyuserid"]) if @user.blank?
  login(@user.reload)

  erb :scenario
end


#------------------------------------------------------------------------------
# GET /feed
#----------

get "/feed" do
  @comics = ComicStrip.order("comic_strips.created_at DESC").includes(:collages).order("collages.position ASC")
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
# GET /license
#----------

get "/license" do
  erb :license
end

#------------------------------------------------------------------------------
# GET /comic
#----------

get "/comic" do
  @comic   = @current_user.comic_strips.order("created_at DESC").where(:finished_at => nil).limit(1).first

  erb :comic
end


#------------------------------------------------------------------------------
# GET /comic
#----------

get "/comics", :provides => :json do
  @comics = @current_user.comic_strips.order("created_at DESC")

  return @comics.to_json(:include => [:collages])
end



#------------------------------------------------------------------------------


get "/selfie" do
  "users/#{request.cookies["pyuserid"]}/1_sticker.png"
end
