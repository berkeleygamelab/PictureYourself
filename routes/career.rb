#------------------------------------------------------------------------------
# GET careers/:career/backgrounds
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


#------------------------------------------------------------------------------
# GET careers/:career/stickers
#------------------

get '/careers/:career/stickers' do |career|
  begin
    stickers = {}

    # Define an array of clothes for the career.
    clothes_array = []

    # NOTE: If the career chosen is college, then we use the original routes
    # to clothes/people/objects defined in college_career_objects.json. Why?
    # Because these objects have a well-defined mapping that associates two
    # images with a clothing object: foreground object (usually the clothing) and
    # backgorund object (usually the customizable chroma skin color).
    # We don't yet have such mappings for other careers.
    if career == "college"
      f = File.open(settings.root + '/public/college_career_objects.json')
      file_names = JSON.parse(f.read)
      file_names.each do |fn|
        relative_fn = fn["source"].split("/public/")[-1]
        clothes_array << fn.merge(:source => relative_fn, :name => relative_fn)
      end
    else
      file_names = Dir["#{settings.root}/public/images/careers/#{career}/clothes/*"]
      file_names.each do |fn|
        relative_fn = fn.split("/public/")[-1]
        clothes_array << {:source => relative_fn, :name => relative_fn, "back_source" => "", "fore_source" => ""}
      end
    end

    stickers["clothes"] = clothes_array

    # Define an array of objects for the career.
    array = []
    file_names = Dir["#{settings.root}/public/images/careers/#{career}/objects/*"]
    file_names.each do |fn|
      relative_fn = fn.split("/public/")[-1]
      array << {:source => relative_fn, :name => relative_fn, "back_source" => "", "fore_source" => ""}
    end

    stickers["objects"] = array

    # Define an array of people for the career.
    array = []
    file_names = Dir["#{settings.root}/public/images/careers/#{career}/people/*"]
    file_names.each do |fn|
      relative_fn = fn.split("/public/")[-1]
      array << {:source => relative_fn, :name => relative_fn, "back_source" => "", "fore_source" => ""}
    end

    stickers["people"] = array

    return {"stickers" => stickers, "categories" => {
        "clothes" => "Clothes",
        "objects" => "Objects",
        "people"  => "People"
      }
    }.to_json

  rescue Errno::ENOENT
    status 404
  rescue => e
    puts e.inspect
    status 500
  end
end
