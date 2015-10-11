# This file is responsible for creating a mapping between files named with _display
# suffix to their respective foreground and background images.
# For instance, to create a mapping for clothing objects for college career, I did
# the following:
# ruby map_chroma_objects.rb > public/editable_clothes/college.json

require 'json'

# TODO: Ask for user input rather than hard-coding here.
directory_to_map = "public/images/careers/college/clothes"
folders = Dir.glob(directory_to_map + "/*").reject{|f| f.include? '0-' }

array = []
folders.each do |file|
  name = file.split("/").last.gsub(".png", "")
  if name.include? '_display'
    name.gsub!(/_\w+/, '')
    stickerData = {name: name, source: file.gsub!('public/', ''), chroma_green: true, back_source: file.gsub('_display', '_back'), fore_source: file.gsub('_display', '_fore')}
  elsif name.include? '_fore' or name.include? '_back'
    next
  else
    stickerData = {name: name, source: file.gsub('public/', ''), chroma_green: false, back_source: '', fore_source: ''}
  end
  stickerData[:text] = name.include? 'text'


  array << stickerData
end


puts array.to_json
