require 'sinatra'


get '/index' do
  erb :index
end

get '/index' do
  erb :index
end

get '/result' do
  erb :result
end

get '/launch' do
  system("./test3 public/img/test.jpg"+" "+params[:x]+" "+params[:y]+" "+params[:width]+" "+params[:height])
  #system("./test3 public/img/student2.jpg"+" "+params[:x]+" "+params[:y]+" "+params[:width]+" "+params[:height])
  redirect to('/result')
end