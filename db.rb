
get '/seed' do
  #sticker folders and category names
  seed_stickers
  redirect to '/'
end

def seed_stickers
  settings.categories.each do |category|
    dir = "images/stickers/" + category + "/"
    files = Dir.entries("public/"+dir)
    #remove things that don't end in jpg/png
    files.delete_if {|a| not (a.include? ".jpg" or a.include? ".png")}

    files.each do |file|
      unless Sticker.first(:name=>file.split('.').first)
        Sticker.create(name: file.split('.').first, source: dir + file, category: category)
      end
    end

  end

end 


# Database setup and table definitions

DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/PictureYourself.db")

class User
  include DataMapper::Resource

  property :id, Serial
  property :username, Text
  property :password, Text
  property :email, Text
  property :current_scenario, Text
end

class User_Scenario
  include DataMapper::Resource 
  
  property :id, Serial
  property :user_id, Text
  property :sticker_states, Text
  property :snapshot_source, Text
  
end

class Sticker_State
  include DataMapper::Resource 
  
  property :id, Serial
  property :sticker_id, Text
  property :sticker_states, Text
  property :snapshot_source, Text
  
end

=begin
 categories: background,

=end
class Sticker
  include DataMapper::Resource 
  
  property :id, Serial
  property :name, Text
  property :source, Text
  property :category, Text
  
end

class User_Sticker
  include DataMapper::Resource 
  
  property :id, Serial
  property :user_id, Text
  property :name, Text
  property :source, Text
  
end




