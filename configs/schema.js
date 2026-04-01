import { integer, json } from "drizzle-orm/gel-core";
import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  image_url: varchar("image_url", { length: 255 }),   // ✅ snake_case
  subscription: boolean("subscription").default(false),
  credits: integer('credits').default(30)  // 30 credits = 3 videos
});

export const VideoData=pgTable('videoData',{
  id:serial('id').primaryKey(),
  script:json('script').notNull(),
  audioFileUrl:varchar('audioFileUrl').notNull(),
  captions:json('captions').notNull(),
  imageList:varchar('imageList').array(),
  createdBy:varchar('createdBy').notNull()
})