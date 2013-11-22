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

class Sticker
  include DataMapper::Resource 
  
  property :id, Serial
  property :name, Text
  property :source, Text
  property :type, Text
  
end

class User_Sticker
  include DataMapper::Resource 
  
  property :id, Serial
  property :user_id, Text
  property :name, Text
  property :source, Text
  
end

