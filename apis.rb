# This handles all requests for the actual stickers, backgrounds, frames, etc (OBSOLETE)
# Since sticker, backgrounds, frame, etc information is now saved in JSON files, the JS can 
# simply do an AJAX call for those files directly

# This file is now used for requests involving state

get '/test/stickers' do
  images  = []

  Sticker.all.each do |sticker|
    images << sticker.source
  end

  return images.to_json
end


post '/saveToGallery' do
  begin
    parsed = JSON.parse request.body.read
    title = parsed["title"]
    pyuserid = parsed["pyuserid"]
    image = parsed["image"].split(',')[1]

    dirname = "public/collages/#{pyuserid}"
    unless File.directory?(dirname)
      Dir.mkdir(dirname)
    end

    File.open("#{dirname}/#{title}.png", 'wb') do |f|
      f.write(Base64.decode64(image))
    end
    
    # status 200
    "collages/#{pyuserid}/#{title}.png"
  rescue => exception
    puts exception.inspect
    status 500
  end
end

# Returns path to all collages
get '/getCollages' do 
  result = []
  Dir.glob("public/collages/*/**").each do |x| 
    x = x.gsub("public/", "") unless x.nil?
    result << {source: x} 
  end
  result.to_json
end


# All the canvas's JSON data
post '/save_canvas' do
    begin
        # We have to do this because Angular does not like 'params'
        data = request.body.read
        parsed = JSON.parse data
        pyuserid = parsed["pyuserid"]
        title = parsed["title"]

        # This digs into the parsed JSON deep enough to hit sticker data
        # We want to remove extraneous JSON data, such as data for the tools
        # data["children"][0]["children"].each do |x|
        #     x["children"].select! { |h| h["className"].eql? "Image" } if x["children"]
        # end

        filedir = "public/users/#{pyuserid}"
        unless File.directory? filedir
          Dir.mkdir filedir
        end

        File.open("#{filedir}/#{title}.json", "w" ){|f| f.write data }
        status 200
    rescue => exception
        puts exception.inspect
        status 500
    end

end

post '/load_canvas' do
  begin
      # We have to do this because Angular does not like 'params'
      data = request.body.read
      parsed = JSON.parse data
      pyuserid = parsed["pyuserid"]
      title = parsed["title"]

      file = File.open("public/users/#{pyuserid}/#{title}.json", "r" )
      file.read
      
  rescue Errno::ENOENT 
      status 404
  rescue => e
      puts e.inspect
      status 500
  end

end

