require 'sinatra'



get '/' do
  system('mkfifo pipename.pipe')
  system('nohup ./test3 test.jpg 10 10 200 200 < pipename.pipe &
  echo command > pipename.pipe')
  erb :index
end
