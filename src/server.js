const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  pool: {
    min: 0,
    max: 7
    }
});

app.set('db', db);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${PORT}`);
});