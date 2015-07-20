
#------------------------------------------------------------------------------
# Libraries
#----------
require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'
require 'json'
require 'sinatra/contrib/all'
require 'mail'
require 'fileutils'
require "sinatra/activerecord"
require 'sinatra/flash'

enable :sessions

#------------------------------------------------------------------------------
# App-specific models
#--------------------
require "./models/user.rb"

#------------------------------------------------------------------------------
# Routes
#--------------------
require "./routes/user.rb"
require "./routes/parse.rb"

#------------------------------------------------------------------------------
# Configuration
#--------------
set :port, 80
set :bind, '128.32.189.148'
#trying to lock threads to avoid not receiving requests
set :lock, true
set :server, 'thin'
set :database_file, "database.yml"

# Connects to apis.rb and email.rb
require_relative 'apis'
require_relative 'email'

#mail Settings
domain = ENV["RAILS_HOST"] || 'py-bcnm.berkeley.edu'
options = { :address              => "smtp.gmail.com",
            :port                 => 587,
            :domain               => domain,
            :user_name            => 'picyourfuture',
            :password             => 'Py12ab21yP',
            :authentication       => 'plain',
            :enable_starttls_auto => true  }

Mail.defaults do
  delivery_method :smtp, options
end

before do
  if @current_user.blank? && session[:auth_token].present?
    @current_user = User.find_by_auth_token(session[:auth_token])
    session[:auth_token] = nil if @current_user.blank?
  end
end

def login_user(user)
  session[:auth_token] = user.auth_token
  @current_user        = user

  puts "User should now be logged in. cookies: #{session[:auth_token]} and user: #{@current_user.inspect}"
end

#------------------------------------------------------------------------------
# GET /
#---------

get '/' do
  cookie = request.cookies["pyuserid"]

  # Check if cookie exits, if it does delete pictures associated with cookie
  # TODO: We don't want to be deleting these directories.
  unless cookie.nil?
    name = 'public/users/' + cookie
    FileUtils.rm_rf(Dir.glob(name))
  end
  FileUtils.rm_rf(Dir.glob('uploads/*'))

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
