#all stickers
get '/stickers' do
	stickers = {}
	settings.categories.each do |cat|
		stickers[cat] = {}
	end
	Sticker.all.each do |sticker|
		stickers[sticker.category][sticker.name] = sticker.source
	end
	stickers.to_json
end

get '/stickers/:category' do
	stickers = {}
	Sticker.all(:category => params[:category]).each do |sticker|
		stickers[sticker.name] = sticker.source
	end
	stickers.to_json
end

get '/test/stickers' do
  images  = []

  Sticker.all.each do |sticker|
    images << sticker.source
  end
  puts images

  return images.to_json
end