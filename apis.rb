#all stickers
get '/stickers' do

	categories = {}
	stickers = {}

	Sticker_Category.all(:order=>:folder.asc).each do |cat|
		unless isBackground?(cat.folder)
			categories[cat.folder] = cat.title
			stickers[cat.folder] = {}
		end
	end

	Sticker.all.each do |sticker|
		unless isBackground?(sticker.category)
			if Sticker_Category.first(:folder => sticker.category)
				stickers[sticker.category][sticker.name] = sticker.source
			end
		end
	end

	"{\"stickers\":"+stickers.to_json+", \"categories\":"+categories.to_json+"}"
end

#get categories, good for backgrounds and frames
get '/stickers/:category' do
	stickers = {}

	if cat = Sticker_Category.first(:folder=>params[:category])
		puts "Cat: " + cat.folder
		# Sticker.all(:category=>cat.folder).each do |sticker|
		# 	puts sticker.name
		# end
		Sticker.all(:category=>cat.folder).each do |sticker|
			puts "Sticker: " + sticker.name
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
  puts images

  return images.to_json
end

def isBackground? (category)
	['backgrounds','frames'].include? category
end
