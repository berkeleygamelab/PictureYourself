#This is essentially the model that deals with saving information to the database
#Currently, it just handles stickers 

get '/seed' do
  #sticker folders and category names
  seed_categories
  seed_stickers
  redirect to '/selfie'
end

#completely resets all the stickers and reseeds the database
get '/reset_stickers' do  
  Sticker.destroy
  redirect to '/seed' 
end

def seed_stickers
  Sticker_Category.all.each do |category|
    dir = "images/stickers/" + category.display_order.to_s + "-" + category.folder + "/"
    files = Dir.entries("public/"+dir)

    #remove things that don't end in jpg/png
    files.delete_if {|a| not (a.include? ".jpg" or a.include? ".png")}

    files.each do |file|
      
      unless Sticker.first(:name=>file.split('.').first)
        name, display = file.split('.').first.split('_')
        
        # Skip files ending in fore or back (for chroma green)
        unless display == 'fore' || display == 'back'
          sticker = Sticker.create(name: name, source: dir + file, category: category.folder)

          # If sticker is a display sticker assign background and foreground properties
          if display == 'display'
            file_extension = file[file.length - 4...file.length]
            sticker.chroma_green = true
            sticker.fore_source = dir + name + "_fore" +  file_extension
            sticker.back_source = dir + name + "_back" +  file_extension
            sticker.save
          end
        
        end
     
      end
    end

  end

end 

def seed_categories
  categories = Dir["public/images/stickers/**/"].each{|cat| cat.gsub!('public/images/stickers/','').slice!('/')}
  categories.delete_at(0) #gets rid of empty element
  
  #entries format "<display_order>-<folder>" e.g. 0-backgrounds
  categories.each do |entry|
    display_order,cat = entry.split('-')
    unless Sticker_Category.first(:folder => cat) || cat.nil? || display_order.nil?
      Sticker_Category.create(title: cat.split('_').map(&:capitalize)*' ', folder:cat, display_order:display_order)
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
  property :chroma_green, Boolean, :default => false 
  property :back_source, Text, :default => ""
  property :fore_source, Text, :default => ""

  
end

class User_Sticker
  include DataMapper::Resource 
  
  property :id, Serial
  property :user_id, Text
  property :name, Text
  property :source, Text
  
end

class Sticker_Category
  include DataMapper::Resource

  property :id, Serial
  property :title, Text
  property :folder, Text
  property :display_order, Integer
end



