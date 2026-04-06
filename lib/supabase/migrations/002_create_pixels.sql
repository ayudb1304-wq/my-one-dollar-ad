-- Migration 2: Pixels table
CREATE TYPE pixel_status AS ENUM ('pending', 'active', 'expired');

CREATE TABLE pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  x INT NOT NULL,
  y INT NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  owner_id UUID REFERENCES users(id),
  image_url TEXT,
  destination_url TEXT,
  display_name TEXT,
  color TEXT,
  payment_id TEXT,
  status pixel_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pixels_status ON pixels(status);
CREATE INDEX idx_pixels_owner ON pixels(owner_id);
CREATE INDEX idx_pixels_coords ON pixels(x, y);

-- Prevent invalid dimensions
ALTER TABLE pixels ADD CONSTRAINT no_negative_dims CHECK (width > 0 AND height > 0);

-- Keep blocks within the 1000x1000 grid
ALTER TABLE pixels ADD CONSTRAINT grid_bounds CHECK (x >= 0 AND y >= 0 AND x + width <= 1000 AND y + height <= 1000);
