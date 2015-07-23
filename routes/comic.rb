
#------------------------------------------------------------------------------
# POST /comic/:id
#---------------

post '/comic/:id', :provides => :json do |id|
  @comic = ComicStrip.find_by_id(id)
  @comic.update_column(:finished_at, Time.now)
  return @comic.to_json
end
