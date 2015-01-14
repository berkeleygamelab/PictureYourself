require 'json'
open('public/global_json/stickers.json', 'w') do |f|
    folders = Dir.glob('public/images/stickers/*').reject{|f| f.include? '0-' }
    categories = {}
    stickers = {}

    folders.each do |folder| 
        sticker = {}
        fname = folder.gsub(/public\/images\/stickers\/\d+\-/, '')
        stickers[fname] = sticker
        categories[fname] = fname.gsub('_', ' ').split.map(&:capitalize).join(' ')
        files = Dir.glob("#{folder}/*")
        files.each do |file|
            name = file.gsub("#{folder}/", '').gsub('.png', '')
            if name.include? '_display'
                name.gsub!(/_\w+/, '')
                stickerData = {name: name, source: file.gsub!('public/', ''), category: fname, chroma_green: true, 
                        back_source: file.gsub('_display', '_back'), fore_source: file.gsub('_display', '_fore')}
            elsif name.include? '_fore' or name.include? '_back'
                next
            else
                stickerData = {name: name, source: file.gsub('public/', ''), category: fname, chroma_green: false, back_source: '', fore_source: ''}
            end
            stickerData[:text] = name.include? 'text'
            sticker[name] = stickerData
        end
    end
    f.write({stickers: stickers, categories: categories}.to_json)
end