#writes scenario image to server
post '/email' do
  data = params[:data].split(',')[1]
  #how about... pyuserid
  dirname = 'email/' + params[:pyuserid]
  unless File.directory?(dirname)
    Dir.mkdir(dirname)
  end
  # fix - fix to have dynamic png numbers - or naming (pic_index.filetype)
  File.open(dirname+'/1.png', 'wb') do |f|
    f.write(Base64.decode64(data))
  end
  status 200
end

#sends email and attaches user's scenario to email
post '/send_email' do
  pyuserid = params[:pyuserid]
  filepath = 'email/'+pyuserid+'/1.png'  
  emails = params[:emails]

  Mail.deliver do
    to emails
    from 'picyourfuture@gmail.com'
    subject "PIC YOUR FUTURE"
    body "PIC Your Future at Berkeley\nwww.py-bcnm.berkeley.edu\n;)"
    add_file filepath
  end
end