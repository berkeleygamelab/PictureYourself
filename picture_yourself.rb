#Main file to be executed

require 'sinatra'
require 'sinatra-websocket'
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
set :server, 'thin'
set :sockets, []
# set :port, 9393
# set :bind, 'localhost'


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
  
  # Check if cookie exits, if it does delete pictures associated with cookie
  unless cookie.nil?
    # TODO: Delete all pictures
    name = 'public/users/' + cookie
    FileUtils.rm_rf(Dir.glob(name))
  end
  FileUtils.rm_rf(Dir.glob('uploads/*'))

  erb :index
end

post '/fileupload' do
    data = params[:data].split(',')[1]
    dirname = 'uploads/'+params[:name]
    dirNumber = params[:count]

    unless File.directory?(dirname)
      FileUtils.mkpath dirname
    end

    # fix - fix to have dynamic png numbers - or naming
    File.open("#{dirname}/#{dirNumber}.png", 'wb') do |f|
      f.write(Base64.decode64(data))
    end
    # Needs to be updated to account for errors
    status 200
end

post '/grabcut' do
  params = JSON.parse request.body.read, :symbolize_names => true
  filename = "#{params[:pyuserid]}/#{params[:count]}.png"

  if File.exist? "public/users/#{params[:pyuserid]}/1_sticker.png"
    puts "Previous 1_sticker.png file did not get renamed"
  end

  if OS.mac?
    system("./grabcut uploads/#{filename} #{params[:coords]} #{params[:pyuserid]}")
  elsif OS.unix?
    system("./opencv_trans_UNIX uploads/" + filename + ' ' + params[:coords] + ' ' + params[:pyuserid])
  end

  # '1_sticker.png' is a hardcoded value in opencv. Hacky workaround because I don't have opencv source
  # outputName = "public/users/#{params[:pyuserid]}/1_sticker.png"
  # if File.exist? outputName
  #   begin
  #     File.rename outputName, "public/users/#{params[:pyuserid]}/#{params[:count]}.png"
  #   rescue SystemCallError
  #     puts "1_sticker.png could not be renamed"
  #     status 500
  #   end
  # end

  "users/#{params[:pyuserid]}/#{params[:count]}.png"
end


# Going to eventually deprecate
get '/scenario' do
  erb :scenario
end

get '/snapshot' do
  erb :snapshot
end

get '/background' do 
  erb :background
end

get '/slideshow' do 
  erb :slideshow
end


#currently unused 
post '/session' do
  #sticker src, left & top (location) are properly passed
  #rotation information is also passed, but as a matrix transformation (i think)
  #can be extended to additional sticker data, as long as that information is accessible from the html
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
