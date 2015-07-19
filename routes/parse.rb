# This file is responsible for handling any parsing logic we do with
# files.

#------------------------------------------------------------------------------
# handles OS detection for openCV
#--------------------------------

module OS
  def OS.windows?
    (/cygwin|mswin|mingw|bccwin|wince|emx/ =~ RUBY_PLATFORM) != nil
  end

  def OS.mac?
   (/darwin/ =~ RUBY_PLATFORM) != nil
  end

  def OS.unix?
    !OS.windows?
  end

  def OS.linux?
    OS.unix? and not OS.mac?
  end
end

#------------------------------------------------------------------------------
# POST /fileupload
#-----------------

post '/fileupload' do
    parsed = JSON.parse request.body.read, :symbolize_names => true
    dirname = 'uploads/'+parsed[:name]
    dirNumber = parsed[:count]
    image = parsed[:data].split(',')[1]

    unless File.directory?(dirname)
      FileUtils.mkpath dirname
    end

    File.open("#{dirname}/#{dirNumber}.png", 'wb') do |f|
      f.write(Base64.decode64(image))
    end
    # Needs to be updated to account for errors
    status 200
end

post '/grabcut' do
  parsed = JSON.parse request.body.read, :symbolize_names => true
  filename = "#{parsed[:pyuserid]}/#{parsed[:count]}.png"

  # TODO: What was the decision to separate the OpenCV libraries by OS? grabcut
  # works on Ubuntu while opencv_trans_UNIX is always missing some .so files. For
  # now, we'll go with grabcut for all OS.
  # if OS.mac?
  #   system("./grabcut uploads/#{filename} #{parsed[:coords]} #{parsed[:pyuserid]}")
  # elsif OS.unix?
  #   system("./opencv_trans_UNIX uploads/" + filename + ' ' + parsed[:coords] + ' ' + parsed[:pyuserid])
  # end
  system("./grabcut uploads/#{filename} #{parsed[:coords]} #{parsed[:pyuserid]}")

  "users/#{parsed[:pyuserid]}/#{parsed[:count]}_sticker.png"
end
