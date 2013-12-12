require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'
require 'json'

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

get '/' do
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
  system('./opencv_trans ' + 'uploads/' + params[:filename] + ' ' + params[:coords] + ' ' + params[:pyuserid])
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
  puts "EMAIL"

  puts params

  data = params[:data].split(',')[1]
    dirname = 'email/'
    unless File.directory?(dirname)
      Dir.mkdir(dirname)
    end
    # fix - fix to have dynamic png numbers - or naming
    File.open(dirname+'/1.png', 'wb') do |f|
      puts "write"
        f.write(Base64.decode64(data))
    end
end


post 'send_email' do

end


get '/scenario' do
  erb :scenario
end


