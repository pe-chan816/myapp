# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_07_31_154206) do

  create_table "bars", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "address"
    t.string "name"
    t.string "phone_number"
    t.bigint "hashtag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "lat"
    t.float "lng"
    t.index ["hashtag_id"], name: "index_bars_on_hashtag_id"
  end

  create_table "favorites", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "user_id"
    t.integer "tweet_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tweet_id"], name: "index_favorites_on_tweet_id"
    t.index ["user_id", "tweet_id"], name: "index_favorites_on_user_id_and_tweet_id", unique: true
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "hashtags", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "hashname"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["hashname"], name: "index_hashtags_on_hashname", unique: true
  end

  create_table "latlngs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.float "lat"
    t.float "lng"
    t.bigint "hashtag_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["hashtag_id"], name: "index_latlngs_on_hashtag_id"
  end

  create_table "recipes", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "material"
    t.integer "amount"
    t.string "unit"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "hashtag_id", null: false
    t.integer "position"
    t.index ["hashtag_id"], name: "index_recipes_on_hashtag_id"
  end

  create_table "relationships", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "follower_id"
    t.integer "followed_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["followed_id"], name: "index_relationships_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_relationships_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_relationships_on_follower_id"
  end

  create_table "tweet_hashtag_relations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "tweet_id"
    t.bigint "hashtag_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["hashtag_id"], name: "index_tweet_hashtag_relations_on_hashtag_id"
    t.index ["tweet_id"], name: "index_tweet_hashtag_relations_on_tweet_id"
  end

  create_table "tweets", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "content"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "tweet_image"
    t.index ["user_id", "created_at"], name: "index_tweets_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_tweets_on_user_id"
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "password_digest"
    t.string "remember_digest"
    t.boolean "admin", default: false
    t.string "profile_image"
    t.boolean "guest", default: false
    t.string "unique_name"
    t.text "self_introduction"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "bars", "hashtags"
  add_foreign_key "latlngs", "hashtags"
  add_foreign_key "recipes", "hashtags"
  add_foreign_key "tweet_hashtag_relations", "hashtags"
  add_foreign_key "tweet_hashtag_relations", "tweets"
  add_foreign_key "tweets", "users"
end
