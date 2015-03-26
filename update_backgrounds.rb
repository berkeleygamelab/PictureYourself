require 'json'
open('public/global_json/backgrounds.json', 'w') do |f|
    b = {}
    backgrounds = Dir.glob('public/images/stickers/0-backgrounds/*')
    backgrounds.each do |background|
        name = background.gsub('public/images/stickers/0-backgrounds/', '').gsub(/\.(jpg|png)/, '')
        b[name] = {name: name, source: background.gsub('public/', ''), category: 'backgrounds'}
    end
    f.write(b.to_json)
end