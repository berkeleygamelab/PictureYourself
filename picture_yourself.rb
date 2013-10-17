require 'sinatra'
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

post '/fileupload' do
    File.open('uploads/'+ params[:uploadedFile][:filename], 'w') do |f|
        f.write(params[:uploadedFile][:tempfile].read)
    end
    return "The file was successfully uploaded!"
end