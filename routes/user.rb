# This file is responsible for controlling everything related to the user resource,
# whether it's logging in, signing up, or listing all users.


#------------------------------------------------------------------------------
# GET /
#---------

get "/users", :provides => :json do
  if params[:token] == "R7dBjMP39"
    content_type :json
    @users = User.all
    @users.to_json
  end
end

#------------------------------------------------------------------------------
# GET /login
#---------

get "/login" do
  erb :login
end

#------------------------------------------------------------------------------
# POST /login
#---------

get "/login" do
  # TODO
end

#------------------------------------------------------------------------------
# GET /signup
#---------

get "/signup" do
  erb :signup
end

#------------------------------------------------------------------------------
# POST /signup
#---------

post "/signup" do
  # TODO
end

#------------------------------------------------------------------------------

# TODO: Old code that needs to be removed or integrated. Currently unused.
post '/session' do
  #sticker src, left & top (location) are properly passed
  #rotation information is also passed, but as a matrix transformation (i think)
  #can be extended to additional sticker data, as long as that information is accessible from the html
  dirname = 'session/'
  unless File.directory?(dirname)
    Dir.mkdir(dirname)
  end
  # fix - fix to have dynamic txt numbers - or naming
  File.open(dirname+'/test.txt', 'wb') do |f|
    puts "write\n "
      f.write(params)
  end
end
