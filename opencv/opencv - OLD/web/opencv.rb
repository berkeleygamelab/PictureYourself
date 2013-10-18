require 'sinatra'

get '/index' do
  erb :index
end

get '/launch' do
  system("./test3 test.jpg")
  redirect to('/index')
end