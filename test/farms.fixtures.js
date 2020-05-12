function makeFarmsArray() {
  return [
    {
      id: 1,
      farm_name: "Old MacDonald's Farm",
      address_1: "123 MacDonald Lane",
      city: "Metropolis",
      zip_code: 12345,
      phone_number: "555-555-1234",
      contact_name: "Joe MacDonald",
      farm_description: "With a cluck cluck here and a moo moo here, Old MacDonald specializes in poultry AND beef. Call us today for more information about our products.",
      state: "FL",
      address_2: "",
      archived: false,
      date_modified: "2020-04-22T16:28:32.615Z"
    },
    {
      id: 2,
      farm_name: "Lorem Ipsum Farm",
      address_1: "123 Sit Amet Road",
      city: "Consequat",
      zip_code: 54321,
      phone_number: "555-555-4321",
      contact_name: "Loren Ipsum",
      farm_description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      state: "FL",
      address_2: "",
      archived: false,
      date_modified: "2020-04-25T16:28:32.615Z"
    },
  ]
}

function makeMaliciousFarm() {
  const maliciousFarm = {
    id: 1,
    farm_name: "Bad Seed Farm",
    address_1: `Not actually an address <script>alert("xss");</script>`,
    city: "Metropolis",
    zip_code: 12345,
    phone_number: "555-555-1234",
    contact_name: "Joe MacDonald",
    farm_description: `<strong>Not</strong> a description here either <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`,
    state: "FL",
    address_2: "",
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

module.exports = {
  makeFarmsArray,
  makeMaliciousFarm
}