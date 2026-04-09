-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial products from the original shop
INSERT INTO products (name, description, price, image_url, category, in_stock) VALUES
  ('Face Serum', 'Premium face serum for radiant skin', 25.00, '/images/face-serum.jpg', 'Skincare', true),
  ('Body Lotion', 'Hydrating body lotion for smooth skin', 30.00, '/images/body-lotion.jpg', 'Skincare', true),
  ('Hair Oil', 'Nourishing hair oil for healthy hair', 20.00, '/images/hair-oil.jpg', 'Haircare', true),
  ('Lip Balm', 'Moisturizing lip balm for soft lips', 10.00, '/images/lip-balm.jpg', 'Skincare', true),
  ('Hand Cream', 'Rich hand cream for soft hands', 15.00, '/images/hand-cream.jpg', 'Skincare', true),
  ('Perfume', 'Elegant fragrance for everyday use', 50.00, '/images/perfume.jpg', 'Fragrance', true);
