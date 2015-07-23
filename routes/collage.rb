
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
  puts "\n\n\nBEGINNING TO PARSE /collages now..."

  begin
    puts "\n\n\nBEGINNING TO PARSE /collages..."

    parsed   = JSON.parse request.body.read

    puts "parsed = #{parsed}\n\n\n"

    if @current_user
      pyuserid = @current_user.uuid
    else
      pyuserid = request.cookies["pyuserid"]
    end

    puts "pyuserid = #{pyuserid}\n\n\n"

    image     = parsed["image"].split(',')[1]
    dirname   = user_collage_file_path(pyuserid)
    file_name = SecureRandom.hex + ".png"

    puts "dirname = #{dirname} & file_name = #{file_name}"

    # Create if the directory doesn't exist yet.
    unless File.directory?(dirname)
      puts "Making directory!"
      Dir.mkdir(dirname)
    end

    puts "#{dirname}/#{file_name}"

    # Create a new file and save the image.
    File.open("#{dirname}/#{file_name}", 'wb') do |f|
      f.write(Base64.decode64(image))
    end

    # At this point, everything worked and the file is persisted to disk. Let's
    # create a new Collage object.
    puts "Saving college!"

    @collage           = Collage.new
    @collage.user_id   = @current_user.id
    @collage.file_name = file_name
    @collage.save!

    puts "Collage saved! Returning...\n\n\n"


    return "#{user_collage_path(pyuserid)}/#{file_name}"
  rescue => exception
    puts "[Error] Something went wrong:\n\n\n"
    puts exception.inspect
    puts "\n\n\n"
    status 500
  end
end
