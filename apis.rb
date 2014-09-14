#This handles all requests for the actual stickers, backgrounds, frames, etc

get '/test/stickers' do
  images  = []

  Sticker.all.each do |sticker|
    images << sticker.source
  end

  return images.to_json
end

post '/save_canvas' do
    # All the canvas's JSON data
    # We have to do this because Angular does not like 'params'
    data = request.body.read
    File.open("public/js/scenario/test.json", "w" ){|f| f.write(data) }
end

def isBackground? (category)
    ['backgrounds','frames'].include? category
end
