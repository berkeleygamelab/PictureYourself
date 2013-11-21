require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'

# DEV
DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/PictureYourself.db")

class PictureYourself
  include DataMapper::Resource

  property :id, Serial
  property :name, Text
  property :picture, Text

end

DataMapper.finalize.auto_upgrade!

get '/' do
  erb :index
end

get '/sticker' do
  @file = 'processed//grabcut_img_alpha.png'
  erb :sticker
end

post '/fileupload' do
    data = params[:data].split(',')[1]
    dirname = 'uploads/'+params[:name]
    unless File.directory?(dirname)
      Dir.mkdir(dirname)
    end
    # fix - fix to have dynamic png numbers - or naming
    File.open(dirname+'/1.png', 'wb') do |f|
      puts "write"
        f.write(Base64.decode64(data))
    end
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
    puts "write"
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



