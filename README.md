PictureYourself
===============

Project Description: The Picture Yourself application uses visual storytelling practices like the "selfie" to help improve college access and provide students with a tool for navigate the college process. 


To run this app locally: 
Make sure Ruby is installed 
bundle install

Open terminal and navigate to the PictureYourself root folder.

Run: bundle install 
When gems are all installed, run: shotgun picture_yourself.rb 

To contribute to this app:
git checkout -b <name of branch> 
Then submit a pull request.
git push origin <name of branch> 


Troubleshooting: 
Occasionally, closing shotgun (Control-C) will hang, causing the port to be unusable in the future.
To fix this, just run shotgun -p <port number> picture_yourself.rb


