require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'
require 'json'
require 'sinatra/contrib/all'

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

DataMapper.finalize.auto_upgrade!

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
  puts OS.mac?
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

# get '/sticker' do
#   puts params
# end

post '/fileupload' do
    data = params[:data].split(',')[1]
    dirname = 'uploads/'+params[:name]
    # puts 'Params[:name] ' + params[:name]
    # puts 'dirname: ' + dirname
    # puts 'data'
    unless File.directory?(dirname)
      Dir.mkdir(dirname)
      # puts 'Directory should have been written'
    else
      # puts 'Directory already exits'
    end

    # fix - fix to have dynamic png numbers - or naming
    File.open(dirname+'/1.png', 'wb') do |f|
      # puts "write"
      f.write(Base64.decode64(data))
    end
    # Needs to be updated to account for erros
    status 200
end

post '/grabcut' do
  if OS.mac?
    system('./opencv_trans_MAC ' + 'uploads/' + params[:filename] + ' ' + params[:coords] + ' ' + params[:pyuserid])
  elsif OX.unix?
    system('./opencv_trans_UNIX ' + 'uploads/' + params[:filename] + ' ' + params[:coords] + ' ' + params[:pyuserid])
  end
end

get '/selfie' do
  erb :scenario
end

post '/session' do
  puts "CLOSED"
  #sticker src, left & top (location) are properly passed
  #rotation information is also passed, but as a matrix transformation (i think)
  #can be extended to additional sticker data, as long as that information is accessible from the html
  puts params
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

#write email behaviour (save image, attach to email)
post '/email' do
  puts "email\n"

  # puts params

  data = params[:data].split(',')[1]
  #how about... pyuserid
  dirname = 'email/' + params[:pyuserid]
  unless File.directory?(dirname)
    Dir.mkdir(dirname)
  end
  # fix - fix to have dynamic png numbers - or naming (pic_index.filetype)
  File.open(dirname+'/1.png', 'wb') do |f|
    puts "write"
      f.write(Base64.decode64(data))
  end
  status 200
end

post '/send_email' do
  # puts "send_email\n"

  pyuserid = params[:pyuserid]
  filepath = 'email/'+pyuserid+'/1.png'  
  emails = params[:emails]
  # puts pyuserid
  # puts filepath
  # puts emails
  system('python ' + 'sendemail.py '+params[:emails]+' '+filepath)
end


get '/scenario' do
  erb :scenario
end


