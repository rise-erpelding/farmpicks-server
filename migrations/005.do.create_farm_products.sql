CREATE TABLE farm_products (
  farm_id INTEGER 
    REFERENCES farms(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER 
    REFERENCES product_categories(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (farm_id, product_id)
);