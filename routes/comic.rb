
#------------------------------------------------------------------------------
# POST /comic/:id
#---------------

post '/comic/:id', :provides => :json do |id|
  @comic = ComicStrip.find_by_id(id)
  @comic.update_column(:finished_at, Time.now)
  return @comic.to_json
end


#------------------------------------------------------------------------------
# DELETE /comic/:id
#---------------

get '/comic/:id' do |id|
  unless params[:token] == ENV["FEED_EDIT_TOKEN"]
    flash[:error] = "You do not have permission to view this page"
    redirect to("/feed") and return
  end

  @comic = ComicStrip.find_by_id(id)
  @comic.destroy

  flash[:alert] = "You've sucessfully deleted the comic"
  redirect to("feed/edit?token=#{params[:token]}") and return
end
