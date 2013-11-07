require 'sinatra'
require 'base64'
require 'data_mapper'
require 'dm-timestamps'

# DEV
DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/PictureYourself.db")

class PictureYourself
  include DataMapper::Resource

  property :id, Serial
  property :name, Text#, required:true
  property :picture, Text
  
end


get '/' do
  test = PictureYourself.create(File.open('')))
  test.picture = Base64()
  erb :index
end

get '/sticker' do
  system('cp grabcut_img_alpha.png ~/Dropbox/School/NM190/PictureYourself/public/img')
  @file = '/img/grabcut_img_alpha.png'
  erb :sticker
end

post '/fileupload' do
    File.open('uploads/'+ params[:file][:filename], 'w') do |f|
        f.write(params[:file][:tempfile].read)
    end
end

post '/grabcut' do
  puts ''
  puts params[:filename]
  puts params[:coords]
  system('./opencv_trans ' + 'uploads/' + params[:filename] + ' ' + params[:coords])
end