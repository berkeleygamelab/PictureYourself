#------------------------------------------------------------------------------
# GET /:career/backgrounds
#------------------

get '/careers/:career/backgrounds' do |career|
  begin
    backgrounds = []

    file_names = Dir["#{settings.root}/public/images/careers/#{career}/backgrounds/*"]
    file_names.each do |fn|
      relative_fn = fn.split("/public/")[-1]
      backgrounds << {:source => relative_fn, :name => relative_fn}
    end

    return backgrounds.to_json

  rescue Errno::ENOENT
    status 404
  rescue => e
    puts e.inspect
    status 500
  end
end
