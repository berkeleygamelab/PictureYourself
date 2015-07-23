# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150723114745) do

  create_table "collages", force: :cascade do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "user_id"
    t.string   "file_name"
    t.datetime "created_at"
    t.integer  "comic_strip_id"
    t.integer  "position"
  end

  create_table "comic_strips", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "title"
    t.datetime "finished_at"
    t.datetime "created_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "username"
    t.string   "password_digest"
    t.string   "profile_photo_file_name"
    t.string   "uuid"
    t.string   "name"
    t.string   "auth_token"
    t.datetime "created_at"
  end

end
