require 'sinatra'
require 'base64'

get '/' do
  erb :index
end

get '/sticker' do
  #system('cp grabcut_img_alpha.png ~/Dropbox/School/NM190/PictureYourself/public/img')
  @file = 'processed//grabcut_img_alpha.png'
  erb :sticker
end

post '/fileupload' do
    data = params[:data].split(',')[1]
    dirname = 'uploads/'+params[:name]
    unless File.directory?(dirname)
      Dir.mkdir(dirname)
    end
    
    File.open(dirname+'/1.png', 'wb') do |f|
        f.write(Base64.decode64(data))
    end
end

post '/grabcut' do
  system('./opencv_trans ' + 'uploads/' + params[:filename] + ' ' + params[:coords] + ' ' + params[:pyuserid])
end