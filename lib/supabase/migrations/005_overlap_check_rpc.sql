-- Migration 5: RPC function to check pixel overlap
CREATE OR REPLACE FUNCTION check_pixel_overlap(
  sel_x INT,
  sel_y INT,
  sel_width INT,
  sel_height INT
)
RETURNS TABLE(id UUID) AS $$
  SELECT id FROM pixels
  WHERE status IN ('pending', 'active')
    AND x < sel_x + sel_width
    AND x + width > sel_x
    AND y < sel_y + sel_height
    AND y + height > sel_y;
$$ LANGUAGE SQL STABLE;
