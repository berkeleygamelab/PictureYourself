#!/usr/bin/env ruby

#This script finds all non minified, non library javascript and css files in the public directory's subdirectories
#and minifies them with juicer
#to run: ruby minifier.rb

#To run on just one file:
#juicer merge -i <name of file> --force 

Dir.glob('./**/*') do |item|
  # do work on files ending in .rb in the desired directory
    if item.include? ".js" or item.include? ".css" and not item.include? "min.js" and not 
        item.include? "min.css" and not item.include? "libraries" and not item.include? "jquery"
        puts 'juicer merge -i ' + item + ' --force' + "\n"
        system('juicer merge -i ' + item + ' --force')
    end
end