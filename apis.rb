get '/sticker_files/:category' do


end

get '/test/stickers' do
  images  = []

  Sticker.all.each do |sticker|
    images << sticker.source
  end
  puts images

  return images.to_json
end