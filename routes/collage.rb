
#------------------------------------------------------------------------------
# GET /collages
#--------------

get '/collages' do
  result = []
  @collages = Collage.all
  @collages.each do |c|
    result << {source: collages_path + "/" + c.file_name}
  end

  # Dir.glob(collages_file_path + "*/**").each do |x|
  #   x = x.gsub("public/", "") unless x.nil?
  #   result << {source: x}
  # end
  result.to_json
end

#------------------------------------------------------------------------------
# POST /collages
#---------------

post '/collages' do
  begin
    if @current_user
      pyuserid = @current_user.uuid
    else
      pyuserid = parsed["pyuserid"]
    end

    parsed   = JSON.parse request.body.read
    title    = parsed["title"].downcase.strip.gsub(" ", "_")
    image    = parsed["image"].split(',')[1]
    dirname   = user_collage_file_path(pyuserid)

    # Create if the directory doesn't exist yet.
    unless File.directory?(dirname)
      Dir.mkdir(dirname)
    end

    # Create a new file and save the image.
    file_path = "#{dirname}/#{title}.png"
    File.open(file_path, 'wb') do |f|
      f.write(Base64.decode64(image))
    end

    # At this point, everything worked and the file is persisted to disk. Let's
    # create a new Collage object.
    @collage           = Collage.new
    @collage.user_id   = @current_user.id
    @collage.title     = parsed["title"]
    @collage.file_name = title + ".png"
    @collage.save!

    return "#{user_collage_path(pyuserid)}/#{title}.png"
  rescue => exception
    puts "[Error] Something went wrong:\n\n\n"
    puts exception.inspect
    puts "\n\n\n"
    status 500
  end
end
