
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
  logger.info "Beginning to parse /collages..."

  begin
    logger.info "Inside begin block (Beginning to parse /collages...)"

    parsed   = JSON.parse request.body.read

    if @current_user
      pyuserid = @current_user.uuid
    else
      pyuserid = request.cookies["pyuserid"]
    end

    logger.info "pyuserid = #{pyuserid}"

    image     = parsed["image"].split(',')[1]
    dirname   = user_collage_file_path(pyuserid)
    file_name = SecureRandom.hex + ".png"

    logger.info "dirname = #{dirname} & file_name = #{file_name}"

    # Create if the directory doesn't exist yet.
    unless File.directory?(dirname)
      logger.info "Making directory!"
      Dir.mkdir(dirname)
    end

    # Create a new file and save the image.
    File.open("#{dirname}/#{file_name}", 'wb') do |f|
      f.write(Base64.decode64(image))
    end

    # Let's create a new comic only if there are no unfinished comics OR there
    # is a comic with at least 6 collages.
    @comic = @current_user.comic_strips.order("created_at DESC").where(:finished_at => nil).first
    if @comic.blank? || @comic.collages.count >= 6
      @comic = ComicStrip.new
      @comic.user_id = @current_user.id
      @comic.save!
    end

    # At this point, everything worked and the file is persisted to disk. Let's
    # create a new Collage object.
    logger.info "Saving collage!"

    @collage            = Collage.new
    @collage.created_at = Time.now
    @collage.user_id    = @current_user.id
    @collage.file_name  = file_name
    @collage.comic_strip_id = @comic.id
    @collage.position       = @comic.collages.count + 1
    @collage.save!

    logger.info "Collage and comic strip saved! Returning...\n\n\n"


    return "#{user_collage_path(pyuserid)}/#{file_name}"
  rescue => exception
    logger.error "[Error] Something went wrong:\n\n\n"
    logger.error exception.inspect
    status 500
  end
end
