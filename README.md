PictureYourself
===============

## Project Description
The Picture Yourself application uses visual storytelling practices like the "selfie" to help improve college access and provide students with a tool to navigate the college process. 

### To run this app locally: 

- Make sure Ruby is installed. 
  - check by running 'which Ruby' in your terminal. This will tell you the path to the installation if Ruby is installed
  - if Ruby is not installed, download the latest version here: https://www.ruby-lang.org/en/downloads/
- In the terminal, navigate to the PictureYourself root folder
- Run: 'bundle install'
- When gems are all installed, run: 'shotgun picture_yourself.rb'
- Open localhost: < port number given in terminal > in your browser

### To contribute to this app:

- Create a branch with 'git checkout -b <name of branch>'
- Submit a pull request with 'git push origin <name of branch>'
- Have another team member review your code before either of you merge with the master branch

### Troubleshooting
Occasionally, closing shotgun (Control-C) will hang, causing the port to be unusable in the future.
To fix this, run shotgun -p <port number> picture_yourself.rb

### Style
- use 4 spaces (!not tabs!) for indentation
- write descriptive commit messages

### Orientation

#### Frameworks / tools used
  - Project uses Sinatra, Angular.js and Ruby
  - DataMapper.rb is used as an ORM (not anymore)
  - Kinetic.js is used for the image manipulation functionality


#### (! NEW !) File structure and logic
 
  - Controllers:
    - handles user interaction
    - writes / updates scope variables for the view
    - connects view with services and other data objects
    
  - Services
    - like Class functions or "pseudo model" for the stage
    - group together functions and variable that share a common theme
        - eg. Camera service controlls all variables that deal with taking a picture
  
  - Factories
    - like "constructors"
    - create instances of objects
  
  - Helpers
    - functions that deal with setup, independent processes, etc. that don't necessarily relate directly to user interaction
    - don't logically map to abstract entity (e.g. Camera, Sticker)
  
  - Directives
  

#### (! OLD !) File structure and logic

  - public/js/index  : all JS files used for the homepage
  - public/js/scenarios : all JS files used for main interactive page
      - handles stickers being dropped onto image, sends data to kinetic.js   
  - public/js/layout : JS file used to make the navigation bar interactive
  - users/minifier.rb: minifies JS and CSS files before they're run 
  - db.rb : seeds new images loaded into 'public/images' folder into the database
  - scenario.js : HTTP request is made to /stickers. Sticker table is queried, data turned into JSON
  - factories.js : manipulates transparent buttons on images
  
#### Making and Testing Changes

- After making changes to JavaScript or CSS files, don't forget to minify them before running. Instructions for minifying:
    - For all JS/CSS files: ruby /public/minifier.rb
    - For one file: juicer merge -i <name of file> --force 


- When making changes locally, just refreshing the page will register the new changes (Shotgun does NOT need to be restarted). However, Shotgun DOES have to be restarted when installing new gems.
