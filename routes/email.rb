# Handles email requests

#sends email and attaches user's scenario to email
post '/send_email' do
  data = request.body.read
  parsed = JSON.parse data
  emails = parsed["emails"]
  fileName = parsed["fileName"]

  Mail.deliver do
    to emails
    from 'picyourfuture@gmail.com'
    subject "PIC YOUR FUTURE"
    body "PIC Your Future at Berkeley\nwww.py-bcnm.berkeley.edu\n;)"
    add_file 'public/' + fileName
  end
end