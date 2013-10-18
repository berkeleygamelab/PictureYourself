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
  erb :index
end

get '/test' do
  puts 'WORKED!'
  return 
end

post '/fileupload' do
    File.open('uploads/'+ params[:file][:filename], 'w') do |f|
        f.write(params[:file][:tempfile].read)
    end
end

post '/grabcut' do
  system('./test3 ' + params[:filename] + ' ' + params[:coords])
end