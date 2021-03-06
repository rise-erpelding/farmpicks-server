CREATE TABLE favorites (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  favorited_farm INTEGER REFERENCES farms(id),
  favorited_by INTEGER REFERENCES users(id),
  date_created TIMESTAMP DEFAULT now() NOT NULL
);