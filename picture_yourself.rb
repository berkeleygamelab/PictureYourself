require 'sinatra'



get '/' do
  system('mkfifo pipename.pipe')
  system('nohup programname < pipename.pipe &
  echo command > pipename.pipe')
  erb :index
end