const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeFarmsArray() {
  return [
    {
      id: 1,
      farm_name: "Pine Ridge Beef",
      // number_of_favorites: "2",
      products: [
        "meat/poultry",
        "prepared foods"
      ],
      farm_description: "Grass-fed beef from Florida, located in Andalusia. The farm is the only one in Florida that still directly oversees all aspects of raising the livestock. The beef is 100% grassfed and finished, and hormone and antibiotic-free.",
      address_1: "728 Fountain Lane",
      address_2: "",
      city: "Andalusia",
      state: "FL",
      zip_code: "32358",
      contact_name: "Toby Buchanan",
      phone_number: "850-555-5060",
      purchase_options: [
        "shipping",
        "delivery",
        "pick-up",
        "farmers market"
      ],
      purchase_details: "Purchase through our website, through the Andalusia Farmers Market, or pickup directly from the farm. Limited delivery options also available.",
      website: "http://corndog.io/",
      cover_image: "https://cdn.pixabay.com/photo/2016/03/05/19/09/animal-1238273_960_720.jpg",
      profile_image: "https://cdn.pixabay.com/photo/2018/08/23/01/18/cow-3625025_960_720.jpg",
      date_modified: "2020-06-04T14:57:05.623Z",
      archived: false
    },
    {
      id: 2,
      farm_name: "Aldridge Acres",
      // number_of_favorites: "1",
      products: [
        "produce",
        "eggs"
      ],
      farm_description: "Family-owned farm located in Ashford, specializing in heirloom, non-gmo produce using no-till crop rotation methods and integrated pest management.",
      address_1: "63 Meadow Road",
      address_2: "",
      city: "Ashford",
      state: "FL",
      zip_code: "32898",
      contact_name: "Loriabelle Aldridge",
      phone_number: "850-555-1088",
      purchase_options: [
        "pick-up",
        "delivery"
      ],
      purchase_details: "In the Ashford area? Join our CSA subscription! Sign up using the contact farm on our website! We deliver to various locations in the Craig County area, and for a limited time during Covid-19 can do some deliveries to homes.",
      website: "http://tinytuba.com/",
      cover_image: "https://cdn.pixabay.com/photo/2016/04/30/14/48/vegetables-1363033_960_720.jpg",
      profile_image: "https://cdn.pixabay.com/photo/2017/05/23/22/36/vegetables-2338824_960_720.jpg",
      date_modified: "2020-06-04T14:57:05.623Z",
      archived: false
    },
    {
      id: 3,
      farm_name: "O'Quigley Foods",
      // number_of_favorites: "0",
      products: [
        "seafood",
        "prepared foods"
      ],
      farm_description: "Selling a variety of fresh crab dips for all of your crab dip needs! Always made with 100% fresh from the Gulf, jumbo lump crab.",
      address_1: "8583 Lilypad Lane",
      address_2: "",
      city: "Pelham",
      state: "FL",
      zip_code: "33068",
      contact_name: "Homer Bauer",
      phone_number: "850-555-4779",
      purchase_options: [
        "pick-up",
        "farmers market"
      ],
      purchase_details: "Find me at the Pelham Farmer's Market on Sunday mornings or purchase at Pelham Fine Foods, Monday-Friday 9-7. Start a punch card to receive your 10th dip for free. Catering options available for large parties.",
      website: "https://heeeeeeeey.com/",
      cover_image: "https://cdn.pixabay.com/photo/2015/01/16/15/01/crabs-601574_960_720.jpg",
      profile_image: "https://cdn.pixabay.com/photo/2018/05/06/00/37/crustacean-3377646_960_720.jpg",
      date_modified: "2020-06-04T14:57:05.623Z",
      archived: false
    },
    {
      id: 4,
      farm_name: "Treasure Farms",
      // number_of_favorites: "2",
      products: [
        "bee products",
        "bath & body products"
      ],
      farm_description: "From our honeybees to you, raw local honey and other products from the hive. Apiaries located in Samson. Enjoy our liquid gold!",
      address_1: "36 Duke Road",
      address_2: "",
      city: "Samson",
      state: "FL",
      zip_code: "32362",
      contact_name: "Finley Hayes",
      phone_number: "850-555-1969",
      purchase_options: [
        "farmers market",
        "pick-up"
      ],
      purchase_details: "Available for pick-up at our farm in Samson, or at local farmer's markets and events.",
      website: "http://endless.horse/",
      cover_image: "https://cdn.pixabay.com/photo/2019/04/18/17/23/hive-4137534_960_720.jpg",
      profile_image: "https://cdn.pixabay.com/photo/2017/01/06/17/49/honey-1958464_960_720.jpg",
      date_modified: "2020-06-04T14:57:05.623Z",
      archived: false
    }
  ]
}

function makeMaliciousFarm() {
  const maliciousFarm = {
    id: 1,
    farm_name: "Bad Seed Farm",
    address_1: `Not actually an address <script>alert("xss");</script>`,
    address_2: "",
    city: "Metropolis",
    state: "FL",
    zip_code: 12345,
    phone_number: "555-555-1234",
    contact_name: "Joe MacDonald",
    products: ["Meat/Poultry", "Prepared Foods"],
    farm_description: `<strong>Not</strong> a description here either <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`,
    purchase_options: ["Pick-up", "Delivery"],
    purchase_details: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    website: "https://developer.mozilla.org/en-US/",
    cover_image: "https://picsum.photos/600/200",
    profile_image: "https://picsum.photos/200",
    archived: false,
    date_modified: "2020-04-22T16:28:32.615Z"
  }
  const sanitizedFarm = {
    ...maliciousFarm,
    address_1: `Not actually an address &lt;script&gt;alert("xss");&lt;/script&gt;`,
    farm_description: `<strong>Not</strong> a description here either <img src="https://url.to.file.which/does-not.exist">`
  }
  return {
    maliciousFarm,
    sanitizedFarm
  }
}

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'Farmer1',
      password: 'password',
      first_name: 'Farmer',
      last_name: 'User',
      user_type: 'Farmer',
      date_created: "2020-04-22T16:28:32.615Z",
      date_modified: "2020-04-22T16:28:32.615Z"
    },
    {
      id: 2,
      user_name: 'Farmer2',
      password: 'password',
      first_name: 'Farmer',
      last_name: 'Tester',
      user_type: 'Farmer',
      date_created: "2020-04-24T16:28:32.615Z",
      date_modified: "2020-04-24T16:28:32.615Z"
    },
    {
      id: 3,
      user_name: 'Farmer3',
      password: 'password',
      first_name: 'Tester',
      last_name: 'Farmer',
      user_type: 'Farmer',
      date_created: "2020-05-01T16:28:32.615Z",
      date_modified: "2020-05-01T16:28:32.615Z"
    },
    {
      id: 4,
      user_name: 'Farmer4',
      password: 'password',
      first_name: 'User',
      last_name: 'Farmer',
      user_type: 'Farmer',
      date_created: "2020-04-29T16:28:32.615Z",
      date_modified: "2020-04-29T16:28:32.615Z"
    },
    {
      id: 5,
      user_name: 'Consumer1',
      password: 'password',
      first_name: 'Test',
      last_name: 'User',
      user_type: 'Consumer',
      date_created: "2020-04-25T16:28:32.615Z",
      date_modified: "2020-04-25T16:28:32.615Z"
    },
    {
      id: 6,
      user_name: 'Consumer2',
      password: 'password',
      first_name: 'Sample',
      last_name: 'Tester',
      user_type: 'Consumer',
      date_created: "2020-04-28T16:28:32.615Z",
      date_modified: "2020-04-28T16:28:32.615Z"
    }
  ]
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    // .then(() =>
    //   // update the auto sequence to stay in sync
    //   db.raw(
    //     `SELECT setval('blogful_users_id_seq', ?)`,
    //     [users[users.length - 1].id],
    //   )
    // )
}

function makeFavoritesArray() {
  [
    {
      id: 1,
      favorited_farm: 1,
      favorited_by: 5,
      date_created: "2020-05-14T16:28:32.615Z"
    },
    {
      id: 2,
      favorited_farm: 1,
      favorited_by: 6,
      date_created: "2020-05-15T16:28:32.615Z"
    },
    {
      id: 3,
      favorited_farm: 2,
      favorited_by: 5,
      date_created: "2020-05-16T16:28:32.615Z"
    },
    {
      id: 4,
      favorited_farm: 4,
      favorited_by: 5,
      date_created: "2020-05-17T16:28:32.615Z"
    },
    {
      id: 5,
      favorited_farm: 4,
      favorited_by: 6,
      date_created: "2020-05-18T16:28:32.615Z"
    }
  ]
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function seedFarmpicksTables(db, users, farms, favorites=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('farms').insert(farms)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('farms_id_seq', ?)`,
      [farms[farms.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
    if (favorites.length) {
      await trx.into('favorites').insert(favorites)
      await trx.raw(
        `SELECT setval('favorites_id_seq', ?)`,
        [favorites[favorites.length - 1].id],
      )
    }
  })
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        farms,
        users,
        favorites
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE farms_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE favorites_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('farms_id_seq', 0)`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('favorites_id_seq', 0)`),
      ])
    )
  )
}


function makeFarmsFixtures() {
  const testUsers = makeUsersArray()
  const testFarms = makeFarmsArray()
  const testFavorites = makeFavoritesArray()
  return { testUsers, testFarms, testFavorites }
}

module.exports = {
  makeFarmsArray,
  makeMaliciousFarm,
  makeUsersArray,
  seedUsers,
  makeFavoritesArray,
  makeAuthHeader,
  seedFarmpicksTables,
  cleanTables,
  makeFarmsFixtures,
}