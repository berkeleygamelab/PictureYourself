#------------------------------------------------------------------------------
# GET /comic
#----------

get "/comics", :provides => :json do
  @comics = @current_user.comic_strips.order("created_at DESC")
  return @comics.to_json(:include => [:collages])
end


#------------------------------------------------------------------------------
# GET /comic
#----------

get "/comic" do
  @comic   = @current_user.comic_strips.order("created_at DESC").where(:finished_at => nil).limit(1).first
  erb :comic
end



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
