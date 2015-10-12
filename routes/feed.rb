#------------------------------------------------------------------------------
# GET /feed
#----------

get "/feed" do
  @comics = ComicStrip.order("comic_strips.created_at DESC").includes(:collages).order("collages.position ASC")
  erb :feed
end

get "/feed/edit" do
  unless params[:token] == ENV["FEED_EDIT_TOKEN"]
    flash[:error] = "You do not have permission to view this page"
    redirect to("/feed") and return
  end

  @comics = ComicStrip.order("comic_strips.created_at DESC").includes(:collages).order("collages.position ASC")
  erb :feed_edit
end
