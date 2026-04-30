INSERT INTO products (
  id, name, price, description, image, category, purchaseurl, pdffile, features, quantity, status, instock, createdat
) VALUES
  ('prod-nasogastrix-fr-5', 'nasogastrix fr 5', 100000, 'nasogastrix fr 5 medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-bionector', 'bionector', 100000, 'bionector medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-cutimed-hydro', 'cutimed hydro', 100000, 'cutimed hydro medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-blue-line-trach-tube-3-0', 'Blue line trach tube 3.0', 100000, 'Blue line trach tube 3.0 medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-disposable-manual-resuscitator', 'Disposable manual resuscitator', 100000, 'Disposable manual resuscitator medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-pediatric-neonatal-mini-trach', 'Pediatric neonatal mini trach', 100000, 'Pediatric neonatal mini trach medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-extension-tube-type-1', 'Extension tube type 1', 100000, 'Extension tube type 1 medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-optilube', 'Optilube', 100000, 'Optilube medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-neonatal-resuscitation', 'Neonatal resuscitation', 100000, 'Neonatal resuscitation medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-tracheal-tube', 'Tracheal tube', 100000, 'Tracheal tube medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW()),
  ('prod-elbow-adapter', 'Elbow adapter', 100000, 'Elbow adapter medical supply', '/Girly.png', 'Medical Supplies', '', '', '[]'::jsonb, 2, 'Available', true, NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  purchaseurl = EXCLUDED.purchaseurl,
  pdffile = EXCLUDED.pdffile,
  features = EXCLUDED.features,
  quantity = EXCLUDED.quantity,
  status = EXCLUDED.status,
  instock = EXCLUDED.instock,
  createdat = COALESCE(products.createdat, EXCLUDED.createdat);
