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

After making changes to JavaScript or CSS files, don't forget to minify them before running.
Instructions for minifying: 
For all JS/CSS files: ruby /public/minifier.rb
For one file: juicer merge -i <name of file> --force 


When making changes locally, just refreshing the page will register the new changes (shotgun does not need to be restarted).
Shotgun does have to be restarted when installing new gems, though.


Troubleshooting: 
Occasionally, closing shotgun (Control-C) will hang, causing the port to be unusable in the future.
To fix this, just run shotgun -p <port number> picture_yourself.rb


Form:
-use 4 spaces for indentation
-write descriptive commit messages
