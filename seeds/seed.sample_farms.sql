BEGIN;

TRUNCATE
  farms,
  users,
  favorites
  RESTART IDENTITY CASCADE;

INSERT INTO farms (farm_name, address_1, city, state, zip_code, phone_number, contact_name, products, farm_description, purchase_options, purchase_details, website, cover_image, profile_image, farm_owner_id)
VALUES
  ('Pine Ridge Beef', '728 Fountain Lane', 'Andalusia', 'FL', '32358', '850-555-5060', 'Toby Buchanan', '{"meat/poultry", "prepared foods"}', 'Grass-fed beef from Florida, located in Andalusia. The farm is the only one in Florida that still directly oversees all aspects of raising the livestock. The beef is 100% grassfed and finished, and hormone and antibiotic-free.', '{"shipping", "delivery", "pick-up", "farmers market"}', 'Purchase through our website, through the Andalusia Farmers Market, or pickup directly from the farm. Limited delivery options also available.', 'http://corndog.io/', 'https://cdn.pixabay.com/photo/2016/03/05/19/09/animal-1238273_960_720.jpg', 'https://cdn.pixabay.com/photo/2018/08/23/01/18/cow-3625025_960_720.jpg', 1),

  ('Aldridge Acres', '63 Meadow Road', 'Ashford', 'FL', '32898', '850-555-1088', 'Loriabelle Aldridge', '{"produce", "eggs"}', 'Family-owned farm located in Ashford, specializing in heirloom, non-gmo produce using no-till crop rotation methods and integrated pest management.', '{"pick-up", "delivery"}', 'In the Ashford area? Join our CSA subscription! Sign up using the contact farm on our website! We deliver to various locations in the Craig County area, and for a limited time during Covid-19 can do some deliveries to homes.', 'http://tinytuba.com/', 'https://cdn.pixabay.com/photo/2016/04/30/14/48/vegetables-1363033_960_720.jpg', 'https://cdn.pixabay.com/photo/2017/05/23/22/36/vegetables-2338824_960_720.jpg', 2),

  ('O''Quigley Foods', '8583 Lilypad Lane', 'Pelham', 'FL', '33068', '850-555-4779', 'Homer Bauer', '{"seafood", "prepared foods"}', 'Selling a variety of fresh crab dips for all of your crab dip needs! Always made with 100% fresh from the Gulf, jumbo lump crab.', '{"pick-up", "farmers market"}', 'Find me at the Pelham Farmer''s Market on Sunday mornings or purchase at Pelham Fine Foods, Monday-Friday 9-7. Start a punch card to receive your 10th dip for free. Catering options available for large parties.', 'https://heeeeeeeey.com/', 'https://cdn.pixabay.com/photo/2015/01/16/15/01/crabs-601574_960_720.jpg', 'https://cdn.pixabay.com/photo/2018/05/06/00/37/crustacean-3377646_960_720.jpg', 3),

  ('Treasure Farms', '36 Duke Road', 'Samson', 'FL', '32362', '850-555-1969', 'Finley Hayes', '{"bee products", "bath and body products"}', 'From our honeybees to you, raw local honey and other products from the hive. Apiaries located in Samson. Enjoy our liquid gold!', '{"farmers market", "pick-up"}', 'Available for pick-up at our farm in Samson, or at local farmer''s markets and events.', 'http://endless.horse/', 'https://cdn.pixabay.com/photo/2019/04/18/17/23/hive-4137534_960_720.jpg', 'https://cdn.pixabay.com/photo/2017/01/06/17/49/honey-1958464_960_720.jpg', 4),

  ('Rex Yates Nursery', '290 Pinnacle Way', 'Wadley', 'FL', '32945', '850-555-1541', 'Elrod Gordon Yates', '{"plants"}', 'Grown organically and all GMO-free, our plants are ready to be planted in your garden. Stop by and see us at our store, we are always happy to give gardening advice!', '{"pick-up"}', 'Visit our store at 290 Pinnacle Way, open Monday-Saturday 9am-4pm.', 'https://smashthewalls.com/', 'https://cdn.pixabay.com/photo/2016/06/23/08/00/plant-1474807_960_720.jpg', 'https://cdn.pixabay.com/photo/2015/10/21/11/17/plant-999375_960_720.jpg', 5),

  ('Happy Hen Farm', '93 Happy Hen Way', 'Vance', 'FL', '32226', '850-555-4329', 'Lawrence Dixon', '{"meat/poultry", "eggs"}', 'Free range pasture-raised eggs and poultry. We use no herbicides, pesticides, chemicals, antibiotics, hormones, or nonsense in raising our chickens. And yes, you may come and meet the chickens. Anytime!', '{"pick-up", "farmers market"}', 'Pick-ups may be done Monday-Friday 9am-12pm at our farm in Vance, or stop by and see us at the Mason County Farmer''s Market on Saturdays 8-noon.', 'http://www.movenowthinklater.com/', 'https://cdn.pixabay.com/photo/2019/03/16/23/08/egg-4059957_960_720.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/05/25/animal-1867521_960_720.jpg', 6),

  ('Grand View Produce', '4670 Silverbell Road', 'Berry', 'FL', '33103', '850-555-6340', 'Wade Compton', '{"produce"}', 'The Compton Family has been growing blueberries on our family farm for over 40 years. Come and try the best blueberries in Northwest Florida', '{"pick-up", "farmers market"}', 'Taste the difference and visit our you-pick farm, open in April-May each year. Picking starts at $8/bucket. Don''t have time to pick? We also have a roadside stand where you can purchase blueberries, and we are at the Silverton Farmer''s Markets in the months of April and May.', 'https://trypap.com/', 'https://cdn.pixabay.com/photo/2016/04/13/07/18/blueberry-1326154_960_720.jpg', 'https://cdn.pixabay.com/photo/2016/12/13/11/19/blueberries-1903868_960_720.jpg', 7),

  ('Breezy Hills Farms', '551 Sunshine Way', 'Cordova', 'FL', '33924', '850-555-5826', 'Jamari Hodge', '{"nuts/dried fruits", "prepared foods"}', 'We founded our pecan orchard in 2006 believing that NW Florida Pecans are the best in the country. We have 400 acres and more than 10,000 trees and work tirelessly to bring you the best pecans.', '{"shipping", "delivery", "pick-up"}', 'Check out our online store on our website! We now offer free shipping for purchases over $50. We are also able to do limited deliveries within Flobama County and Georida County, just select Local Delivery as an option in your cart, or if you would prefer to pick up from the farm, we offer a 15% discount!', 'http://www.koalastothemax.com/', 'https://cdn.pixabay.com/photo/2017/09/09/04/12/tree-2730934_960_720.jpg', 'https://cdn.pixabay.com/photo/2016/02/22/03/54/pecans-1214713_960_720.jpg', 8),

  ('Bullseye Valley Fields', '3035 County Road G', 'Georgianna', 'FL', '33117', '850-555-9345', 'Forrest Mason', '{"dairy", "produce", "preserves/syrup", "prepared foods"}', 'Strawberries grown with love since 1995. Offering you-pick options. Try our strawberry preserves and strawberry yogurt!', '{"pick-up"}', 'Visit the farm in Georgianna for you-pick or strawberry pick-up during the months of April-June. During these months we also offer strawberries to be delivered to you in the Valencia area! Call and ask for Forrest to get on the list.', 'http://www.everydayim.com/', 'https://cdn.pixabay.com/photo/2015/05/26/17/36/strawberry-785068_960_720.jpg', 'https://cdn.pixabay.com/photo/2016/04/15/08/04/strawberries-1330459_960_720.jpg', 9),

  ('Clayton''s Raw Goat Milk', '935 Ashland Boulevard', 'Millport', 'FL', '32748', '850-555-2831', 'Clayton Edwards', '{"dairy"}', 'Our pure-bred Anglo-Nubian goats are 100% grass-fed, no corn, no soy, no wheat, and no GMOs. We use old-fashioned farming practices and the herds are certified. Want to buy a kid? Call Clayton to join the waitlist. We are currently experiencing high demand for goats so be patient with us!', '{"pick-up", "farmers market"}', 'Kid pick-up is on Fridays from 2-6pm at the farm in Millport. You MUST bring your own transportation for the goat and your certification of completion from our online goat-raising class. We will notify you when a kid is ready for you. Please do not show up unless you have been notified that a kid is available for you. Our milk is available as always at our farm and at the Millport Farmer''s Markets on Tuesday evening 4-7pm and Saturday morning 9am-1pm.', 'https://cat-bounce.com/', 'https://cdn.pixabay.com/photo/2017/09/05/22/35/goats-2719445_960_720.jpg', 'https://cdn.pixabay.com/photo/2016/05/08/20/25/glass-1379822_960_720.jpg', 10);

INSERT INTO users (user_name, password, first_name, last_name, user_type)
  VALUES
  ('PineRidgeBeef', '$2a$12$wLnGTblsC1yJVpvsw/p8ouv6lFYxSLaitBiWs58CDxE01QzXmH8hC', 'Toby', 'Buchanan', 'Farmer'),
  ('AldridgeAcres', '$2a$12$aQ4vbsoczNISgraVxfX4eO.t7Y3KoWJPxIESQlB.aoN9x1bJbJvg.', 'Loriabelle', 'Aldridge', 'Farmer'),
  ('OQuigleyFoods', '$2a$12$b7g6Cy1AqCFu0vNuG1xUvOO06osoe/SieXorgbU.0xL954tQsvN8K', 'Homer', 'Bauer', 'Farmer'),
  ('TreasureFarms', '$2a$12$MYfJmAaBqBzeN4HkaLeqJuiS5Bo3nGO34/A7rJMF31tw0BkgsdImO', 'Finley', 'Hayes', 'Farmer'),
  ('RexYates', '$2a$12$QWVcs6jR8Zl5T3d2RRAil.WQF319th0sCBy9oYSD7.UT80dBUnu9S', 'Elrod', 'Yates', 'Farmer'),
  ('HappyHen', '$2a$12$T10z7VhzuQPz3F1UWlHL6ONzs4ebcDGFN9MyPVNYZriZHGYhF8qpe', 'Lawrence', 'Dixon', 'Farmer'),
  ('GrandView', '$2a$12$oSNcyQTNO3hSBz7lpvBWr.RUZ5Y6ShpSROWhxdt.uTYrI5OPAyxxW', 'Wade', 'Compton', 'Farmer'),
  ('BreezyHillsFarms', '$2a$12$NXz/.dnIva/R2LWYvrXMEungQvZkZsDZ.L6LGpHZUX1EVk9Qa5Qke', 'Jamari', 'Hodge', 'Farmer'),
  ('Bullseye', '$2a$12$ZX6sdijA55ChxMv0NPFwWuOWWQoVgE5pveMRTjnMVQw6DVnRkQE7O', 'Forrest', 'Mason', 'Farmer'),
  ('ClaytonsGoat', '$2a$12$M2MZml/nMyMCNs5qXakAUuKVUlnwpF44hiTFgnH8/ggFQeW8WQ3su', 'Clayton', 'Edwards', 'Farmer'),
  ('consumer1', '$2a$12$2G8esEvUZdLKJ4iIN.74E.wXofmdqxlWfVkjnfG.1GNFR5WEBQJdS', 'David', 'Smith', 'Consumer'),
  ('consumer2', '$2a$12$c3jd0K.sf1KsdMzSe62OmeMtkqWx.LChLGw7k.eBBBvnOP488bXFe', 'Mallory', 'Taylor', 'Consumer');

INSERT INTO favorites (favorited_farm, favorited_by)
  VALUES
  (8, 11),
  (5, 11),
  (7, 11),
  (1, 11),
  (6, 12),
  (1, 12),
  (5, 12);

COMMIT;
