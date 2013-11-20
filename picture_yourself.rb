require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'
require 'json'

# DEV

require_relative 'apis'
require_relative 'db'

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
  erb :selfie
end

get '/scenario' do
  erb :scenario
end

get '/seed' do
  file = open('public/images/stickers/filenames.txt','r').read
  file = file.split("\n")
  file.each do |filename|
    Sticker.create(name:filename,source:'images/stickers/'+filename)
  end
end