#Current unused

#This is essentially the model that deals with saving information to the database
#Currently, it just handles stickers

#completely resets all the stickers and reseeds the database
get '/reset_stickers' do
  Sticker.destroy
  redirect to '/seed'
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
