#Main file to be executed

require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'
require 'json'
require 'sinatra/contrib/all'
require 'mail'
require 'fileutils'

set :port, 80
set :bind, '128.32.189.148'
#trying to lock threads to avoid not receiving requests
set :lock, true
#sticker categories
# set :categories, ["accessories","backgrounds","cal_day_pack",
#                     "clothing","dorm_room_pack",
#                     "football_game_pack","frames","misc"]


require_relative 'apis'
require_relative 'db'
require_relative 'email'

DataMapper.finalize.auto_upgrade!

#mail Settings
options = { :address              => "smtp.gmail.com",
            :port                 => 587,
            :domain               => 'py-bcnm.berkeley.edu',
            :user_name            => 'picyourfuture',
            :password             => 'Py12ab21yP',
            :authentication       => 'plain',
            :enable_starttls_auto => true  }


Mail.defaults do
  delivery_method :smtp, options
end


#handles OS detection for openCV
module OS
  def OS.windows?
    (/cygwin|mswin|mingw|bccwin|wince|emx/ =~ RUBY_PLATFORM) != nil
  end

  def OS.mac?
   (/darwin/ =~ RUBY_PLATFORM) != nil
  end

  def OS.unix?
    !OS.windows?
  end

  def OS.linux?
    OS.unix? and not OS.mac?
  end
end


get '/' do
  cookie = request.cookies["pyuserid"]
  
  # Check if cookie exits, if it does delete picture associated with cookie
  unless cookie.nil?
    name = 'public/users/' + cookie + "/1_sticker.png"
    if File.file?(name)
        File.delete(name)
    end
  end

  erb :index
end

post '/fileupload' do
    data = params[:data].split(',')[1]
    dirname = 'uploads/'+params[:name]

    unless File.directory?(dirname)
      FileUtils.mkpath dirname
    end

    # fix - fix to have dynamic png numbers - or naming
    File.open(dirname+'/1.png', 'wb') do |f|
      f.write(Base64.decode64(data))
    end
    # Needs to be updated to account for errors
    status 200
end

post '/grabcut' do
  if OS.mac?
    system('opencv_trans_MAC ' + 'uploads/' + params[:filename] + ' ' + params[:coords] + ' ' + params[:pyuserid])
  elsif OS.unix?
    system('./opencv_trans_UNIX ' + 'uploads/' + params[:filename] + ' ' + params[:coords] + ' ' + params[:pyuserid])
  end
end

#currently this link
get '/selfie' do
  erb :scenario
end

#should switch over to this one
get '/scenario' do
  erb :scenario
end


#currently unused 
post '/session' do
  #sticker src, left & top (location) are properly passed
  #rotation information is also passed, but as a matrix transformation (i think)
  #can be extended to additional sticker data, as long as that information is accessible from the html
  # left = params[:leftArr].split(',')
  # top = params[:topArr].split(',')
  # src = params[:srcArr].split(',')
  # rot = params[:rotArr].split(',')
  dirname = 'session/'
  unless File.directory?(dirname)
    Dir.mkdir(dirname)
  end
  # fix - fix to have dynamic txt numbers - or naming
  File.open(dirname+'/test.txt', 'wb') do |f|
    puts "write\n "
      f.write(params)
  end
end
