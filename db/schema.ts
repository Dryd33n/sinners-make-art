import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
/*
        *************************************************************
        *                                                           *
        *                       SCHEMA.TS                           *
        *                                                           *
        ************************************************************* 

LIST OF TABLES:
    - Home Page Content Table:
        This table holds the information that is displayed on the about me section of the home page
    - Navigation Schema Table:
        This table holds the relevant information to construct a navigation tree
    - Posts Table:
        This table holds the information for all posts to the site, including their title, description
        content and category classification
    - Social Link Table:
        This table holds information to load proper social links
 */





/*
              ********************************************
              *          HOME PAGE CONTENT TABLE         *
              ********************************************

*/
/** HOME PAGE CONtENt TABLE:
 * 
 * Columns:
 * id           - unique identifier number
 * about_title  - title for about me section
 * about_text   - body text for about me section
 * about_images - csv list of images
 */
export const hometable = pgTable('hometable', {
  id : serial("id").primaryKey().notNull(),
  about_title: text('about_title').notNull(),
  about_text: text('about_text').notNull(),
  about_images: text('images').notNull(),
});

export type insertHomeTableContent = typeof hometable.$inferInsert;
export type selectHomeTableContent = typeof hometable.$inferSelect;




/*
              ********************************************
              *          NAVIGATION SCHEMA TABLE         *
              ********************************************

*/
/** NAVIGATION TREE TABLE
 *  
 * Columns:
 * id            - unique identifier number
 * name          - name to display link as
 * path          - path which represents link placement in navigation tree i.e A/B/C
 * link_ovveride - "auto" if using automatic link handling and "/path/to/destination" if setting custom link destination
 * order         - order to display link if node has siblings
 */
export const navTreeTable = pgTable('nav_tree', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  path: text('path').notNull(), // e.g., "1/2/3"
  link_ovveride: text('link_ovveride').notNull().default('auto'), // "auto" or "/path/to/destination"
  order: integer('order').notNull(),
});

export type insertNavTree = typeof navTreeTable.$inferInsert;
export type selectNavTree = typeof navTreeTable.$inferSelect;




/*
              ********************************************
              *                POSTS TABLE               *
              ********************************************

*/
/** POST TABLE
 * 
 * Columns:  
 * title       - title of post
 * description - description of post
 * type        - wether post is 'image' or 'video'
 * content     - content of post either csv image links of video link
 * tag         - classification under nav tree of post I.E A/B/C
 * order       - order to be displayed
 * portfolio   - wether to include in portfolio
 */
export const postsTable = pgTable("posts_table", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "posts_table_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  title: text().notNull(),
  description: text().notNull(),
  type: text().notNull(),
  content: text().notNull(),
  tag: text().notNull(),
  order: integer().notNull(),
  portfolio: boolean().default(false).notNull(),
});

/** Post Item Interface */
export interface PostItem {
    id?: number;         // unique post id
    title: string;       // post title
    description: string; // post description
    type: string;        // photo or video
    content: string;     // images urls csv or video link
    tag: string;         // category
    order: number;       // order in category
    portfolio: boolean;  // show in portfolio
}



/*
              ********************************************
              *             SOCIAL LINK TABLE            *
              ********************************************

*/
/** SOCIAL LINK TABLE
 * 
 * Columns: 
 * id   - unique identifier number
 * name - name to display link as
 * url  - url to link to 
 */
export const socialLinks = pgTable("social_links", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "social_links_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	url: text().notNull(),
	name: text().notNull(),
});
/** * Social Link Item Interface */
export interface SocialLink {
    id?: number;   // unique id number
    name: string;  // text to display social link as
    url: string;   // url to link to
}







export const highlightsTable = pgTable("highlights_table", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "highlights_table_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	highlightTag: text("highlight_tag").notNull(),
	highlightName: text("highlight_name").notNull(),
	highlightDesc: text("highlight_desc").notNull(),
	type: text().notNull(),
	content: text().notNull(),
	order: integer().notNull(),
});


