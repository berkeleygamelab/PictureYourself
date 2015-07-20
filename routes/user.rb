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
# GET /profile
#---------

get "/profile" do
  puts "In /profile now..."
  puts "@current_user: #{@current_user.inspect}"
  puts "session[:auth_token]: #{session[:auth_token]}"

  puts "@current_user.blank? && session[:auth_token].present?: #{@current_user.blank? && session[:auth_token].present?}"


  if @current_user.blank?
    flash[:error] = "You need to login before proceeding!"
    redirect to("/login") and return
  else
    erb :profile
  end
end

#------------------------------------------------------------------------------
# GET /login
#---------

get "/login" do
  if @current_user.present?
    flash[:success] = "You've already logged in"
    redirect to("/profile") and return
  else
    erb :login
  end
end

#------------------------------------------------------------------------------
# GET /logout
#------------

get "/logout" do
  @current_user        = nil
  session[:auth_token] = nil
  flash[:success] = "You've successfully logged out"
  redirect to("/") and return
end

#------------------------------------------------------------------------------
# POST /login
#---------

post "/login" do
  if params[:email].blank?
    flash[:error] = "You need to provide an email!"
    redirect to("/login") and return
  end

  if params[:password_digest].blank?
    flash[:error] = "You need to provide a password!"
    redirect to("/login") and return
  end

  # Let's make sure a user with this email exists.
  @user = User.find_by_email(params[:email])
  if @user.blank?
    flash[:error] = "Could not find user with that email!"
    redirect to("/login") and return
  end

  # Let's make sure the password matches the stored password.
  if Base64.encode64(@user.password_digest) == Base64.encode64(params[:password_digest])
    login_user(@user)
    flash[:success] = "You've successfully logged in!"
    redirect to("/profile") and return
  else
    flash[:error] = "Email and/or password do not match!"
    redirect to("/login") and return
  end
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

post "/users" do

  @user = User.find_by_email(params[:email])
  if @user.present?
    flash[:error] = "User with this email already exists!"
    redirect to("/signup")
  end

  # At this point, we know this is a new email. Let's create the user.
  params[:password_digest] = Base64.encode64(params[:password_digest]) if params[:password_digest].present?

  @user = User.new(params)
  if @user.save
    # Let's create an authentication token and log the user in.
    @user.update_column(:auth_token, SecureRandom.hex)
    @user.update_column(:uuid, request.cookies["pyuserid"]) if request.cookies["pyuserid"].present?
    login_user(@user.reload)

    flash[:success]      = "You've successfully created an account!"
    redirect to("/profile") and return
  else
    flash[:error]  = @user.errors.full_messages.join(", ")
    redirect to("/signup") and return
  end
end


#------------------------------------------------------------------------------
# POST /email

post '/email' do
  data     = request.body.read
  parsed   = JSON.parse data
  emails   = parsed["emails"]
  fileName = parsed["fileName"]

  Mail.deliver do
    to emails
    from 'picyourfuture@gmail.com'
    subject "PIC YOUR FUTURE"
    body "PIC Your Future at Berkeley\nwww.py-bcnm.berkeley.edu\n;)"
    add_file "#{settings.root}/public/#{fileName}"
  end
end

#------------------------------------------------------------------------------
