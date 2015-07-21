#------------------------------------------------------------------------------
# POST /load_canvas
#------------------
post '/load_canvas' do
  begin
    # We have to do this because Angular does not like 'params'
    data     = request.body.read
    parsed   = JSON.parse data

    if @current_user
      pyuserid = @current_user.uuid
    else
      pyuserid = parsed["pyuserid"]
    end
    
    title    = parsed["title"]
    file = File.open(user_selfie_file_path(pyuserid) + "/#{title}.json", "r" )
    file.read
  rescue Errno::ENOENT
    status 404
  rescue => e
    puts e.inspect
    status 500
  end
end

#------------------------------------------------------------------------------
