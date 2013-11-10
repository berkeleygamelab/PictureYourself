require 'sinatra'
require 'base64'

get '/' do
  erb :index
end

get '/login' do
  erb :login
end

get '/sticker' do
  system('cp grabcut_img_alpha.png public/img')
  @file = '/img/grabcut_img_alpha.png'
  erb :sticker
end

post '/fileupload' do
    File.open('uploads/'+ params[:file][:filename], 'w') do |f|
        f.write(params[:file][:tempfile].read)
    end
end

post '/grabcut' do
  #done dynamically pass userid, opencv_trans saves to processed/userid.png
  puts ''
  puts params[:pyuserid]
  puts params[:filename]
  puts params[:coords]
  system('./opencv_trans ' + 'uploads/' + params[:filename] + ' ' + params[:coords])
end

get '/loggedin' do
  @username = params[:username]  
  puts 'username:' + params[:username]  
  erb :index
end

