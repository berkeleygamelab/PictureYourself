# Please note, this is partially untested since I already have everything installed and do not remember the exact steps I took. However, these
# should approximate the steps required to install all the software to run PIC and any troubleshooting can likely be solved through the 
# various software's websites or Google

# Install rvm (https://rvm.io/), a ruby version manager, and then get the most recent stable version of Ruby
if !command -v rvm >/dev/null 2>&1; then
    echo "Installing rvm."
    curl -L https://get.rvm.io | bash -s stable --ruby
    if command -v rvm >/dev/null 2>&1; then
        echo "Rvm installed successfully."
    else
        echo "Rvm failed to install successfully. Exiting";
        exit 1;
    fi

    if command -v ruby >/dev/null 2>&1; then
        echo "Ruby installed successfully."
    else
        echo "Ruby failed to install successfully. Exiting";
        exit 1;
    fi
else
     echo "Installing latest version of Ruby"
     rvm install ruby
     rvm use ruby
fi

# Gems are Ruby packages. Bundler is a specific one that lets you quickly install a lot of other gems defined in the "Gemfile"
if !command -v bundle >/dev/null 2>&1; then
    echo "Installing bundler."
    gem install bundler
fi
# Use bundler to install all other gems
# If there are issues with nokogiri, check the solution from their website. If that doesn't work, try this solution (assuming homebrew is installed)
# http://blog.sailsoftware.co/2014/12/18/rails-4-2-0-rc3-fixing-libiconv-missing-dependency-on-yosemite.html
bundle install

# InstallopenCV. In depth instructions and some troubleshooting at http://www.jeffreythompson.org/blog/2013/08/22/update-installing-opencv-on-mac-mountain-lion/
# First install homebrew (http://brew.sh/), a package manager for Mac 
if !command -v brew >/dev/null 2>&1; then
    echo "Installing brew.";
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)";
fi
brew tap homebrew/science
echo "Installing opencv"
brew install opencv
# If above fails, uncomment line below and try again (or copy and paste line below into shell)
# brew install opencv --env=std

# Compile grabcut. This is necessary because different versions of OSX have libraries that grabcut uses in different places,
# making a single grabcut executable difficult.
cd OpenCVSource
make
if [ -e grabcut ]; then
    echo "Compiled grabcut successfully.";
    # Renames current existing grabcut executable to backup
    mv ../grabcut ../grabcut.backup;
    # Move new executable to PIC root
    mv grabcut ../grabcut;
else
    echo "Compiling grabcut failed. Exiting.";
    exit 1;
fi
echo "\n"
cd .. 
# Everything should be installed at this point. Start the local server. (In the future, can just run line below in shell)
shotgun picture_yourself.rb




