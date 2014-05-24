#This handles all requests for the actual stickers, backgrounds, frames, etc

#all stickers
get '/stickers' do

	categories = {}
	stickers = {}

	Sticker_Category.all(:order=>:display_order.asc).each do |cat|
		unless cat.display_order == 0
			categories[cat.folder] = cat.title
			stickers[cat.folder] = {}
		end
	end

	Sticker.all(:order=>:name.asc).each do |sticker|
		unless isBackground?(sticker.category)
			if Sticker_Category.first(:folder => sticker.category)
				stickers[sticker.category][sticker.name] = sticker
			end
		end
	end

	"{\"stickers\":"+stickers.to_json+", \"categories\":"+categories.to_json+"}"
end

#get categories e.g. backgrounds or frames
get '/stickers/:category' do
	stickers = {}

	if cat = Sticker_Category.first(:folder=>params[:category])
		Sticker.all(:category=>cat.folder).each do |sticker|
			stickers[sticker.name] = sticker.source
		end
	end

	stickers.to_json
end


get '/test/stickers' do
  images  = []

  Sticker.all.each do |sticker|
    images << sticker.source
  end

  return images.to_json
end

def isBackground? (category)
	['backgrounds','frames'].include? category
end
