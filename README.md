PictureYourself
===============

## Project Description
The Picture Yourself application uses visual storytelling practices like the "selfie" to help improve college access and provide students with a tool to navigate the college process. 

### To run this app locally: 

- Run `./install.sh`. This should install all the required libraries and software ([rvm](https://rvm.io/), [ruby](https://www.ruby-lang.org/en/), [brew](http://brew.sh/), [opencv](http://opencv.org/)).

### To contribute to this app:

- Create a branch with `git checkout -b <name of branch>`
- Push code to repo with `git push origin <name of branch>`
- Have another team member review your code before either of you merge with the master branch

### Troubleshooting
Occasionally, closing shotgun (Control-C) will hang, causing the port to be unusable in the future.
To fix this, run `shotgun -p <port number> picture_yourself.rb`

### Style
- Use 4 spaces (**not tabs**) for indentation. Most text editors should automatically change tabs into spaces. 
- Write descriptive commit messages.

#### Frameworks
  - Backend uses Ruby with [Sinatra](http://www.sinatrarb.com/)
  - Frontend includes 
    - [Angular.js](https://angularjs.org/)
    - [jQuery](https://jquery.com/) (which should be removed in favor of only Angular)
    - [Kinetic.js](http://kineticjs.com/) for the canvas functionality
      - Unfortunately, Kinetic.js is no longer supported. The documentation is included in the repo.
    - [slick.js](http://kenwheeler.github.io/slick/) for the background chooser carousel
    - [bootstrap](http://getbootstrap.com/) for modals and various other DOM elements

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
  

- When making changes locally, just refreshing the page will register the new changes (Shotgun does NOT need to be restarted). However, Shotgun DOES have to be restarted when installing new gems.
