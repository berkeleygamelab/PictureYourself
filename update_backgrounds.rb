require 'json'
open('public/global_json/backgrounds.json', 'w') do |f|
    b = {}
    backgrounds = Dir.glob('public/images/stickers/0-backgrounds/*')
    backgrounds.each do |background|
        # background = 'public/images/stickers/0-backgrounds/ASproul.jpg'
        name = background.gsub('public/images/stickers/0-backgrounds/', '').gsub(/\.(jpg|png)/, '')
        b[name] = {name: name, source: background.gsub('public/', ''), category: 'backgrounds'}
    end
    f.write(b.to_json)
end