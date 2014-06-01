PictureYourself
===============

## Project Description
The Picture Yourself application uses visual storytelling practices like the "selfie" to help improve college access and provide students with a tool to navigate the college process. 

### To run this app locally: 

- Make sure Ruby is installed 
- Open terminal and navigate to the PictureYourself root folder
- Run: 'bundle install'
- When gems are all installed, run: 'shotgun picture_yourself.rb'
- Open localhost: <port number given in terminal> in your browser

### To contribute to this app:

- Create a branch with 'git checkout -b <name of branch>'
- Submit a pull request with 'git push origin <name of branch>'
- Have another team member review your code before either of you merge with the master branch

### Troubleshooting
Occasionally, closing shotgun (Control-C) will hang, causing the port to be unusable in the future.
To fix this, run shotgun -p <port number> picture_yourself.rb

### Form
- use 4 spaces (!not tabs!) for indentation
- write descriptive commit messages

### Orientation

#### Frameworks / tools used
  - Project uses Sinatra, Angular.js and Ruby
  - DataMapper.rb is used as an ORM
  - Kinetic.js is used for the image manipulation functionality


#### File structure and organization

  - public/js/index  : all JS files used for the homepage
  - public/js/scenarios : all JS files used for main interactive page
      - handles stickers being dropped onto image, sends data to kinetic.js   
  - public/js/layout : JS file used to make the navigation bar interactive
  - users/minifier.rb: minifies JS and CSS files before they're run 
  - db.rb : seeds new images loaded into 'public/images' folder into the database
  - scenario.js : HTTP request is made to /stickers. Sticker table is queried, data turned into JSON
  - factories.js : manipulates transparent buttons on images
  

After making changes to JavaScript or CSS files, don't forget to minify them before running.
Instructions for minifying: 
For all JS/CSS files: ruby /public/minifier.rb
For one file: juicer merge -i <name of file> --force 


When making changes locally, just refreshing the page will register the new changes (shotgun does not need to be restarted).
Shotgun does have to be restarted when installing new gems, though.
