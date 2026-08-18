-- Разбиение категории "conservation" (Консервация) на специализированные
-- подкатегории и перенос заметки в раздел "Заметки" (notes).

-- 1. Новые подкатегории под разделом "Заготовки" (zagotovki).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Соленья и маринады', 'soleniya-i-marinady', (SELECT id FROM categories WHERE alias = 'zagotovki'), 2, 'Маринованные и солёные овощи: капуста, огурцы, баклажаны и перец.', 'Соленья и маринады — рецепты', 'соленья, маринады, маринованные овощи, рецепты', 'Маринованные и солёные овощи: капуста, огурцы, баклажаны и перец.'),
  (gen_random_uuid(), 'Салаты на зиму', 'salaty-na-zimu', (SELECT id FROM categories WHERE alias = 'zagotovki'), 3, 'Заготовки-салаты из овощей на зиму.', 'Салаты на зиму — рецепты', 'салаты на зиму, заготовки, рецепты', 'Заготовки-салаты из овощей на зиму.'),
  (gen_random_uuid(), 'Овощная икра', 'ovoshhnaya-ikra', (SELECT id FROM categories WHERE alias = 'zagotovki'), 4, 'Икра из баклажанов и кабачков.', 'Овощная икра — рецепты', 'икра из баклажанов, кабачковая икра, рецепты', 'Икра из баклажанов и кабачков.'),
  (gen_random_uuid(), 'Соусы и приправы', 'sousy-i-pripravy', (SELECT id FROM categories WHERE alias = 'zagotovki'), 5, 'Домашний кетчуп, аджика и приправы.', 'Соусы и приправы — рецепты', 'кетчуп, аджика, приправы, рецепты', 'Домашний кетчуп, аджика и приправы.'),
  (gen_random_uuid(), 'Консервированные овощи', 'konservirovannye-ovoshhi', (SELECT id FROM categories WHERE alias = 'zagotovki'), 6, 'Консервированные целиком овощи: горошек, щавель, помидоры и кабачки.', 'Консервированные овощи — рецепты', 'консервированные овощи, горошек, помидоры, рецепты', 'Консервированные целиком овощи: горошек, щавель, помидоры и кабачки.'),
  (gen_random_uuid(), 'Сушка', 'sushka', (SELECT id FROM categories WHERE alias = 'zagotovki'), 7, 'Сушёные овощи, зелень и грибы.', 'Сушка — рецепты', 'сушка, сушёные овощи, рецепты', 'Сушёные овощи, зелень и грибы.');

-- 2. Новая подкатегория заметок под разделом "Заметки" (notes).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Заметки о консервации', 'zametki-o-konservacii', (SELECT id FROM categories WHERE alias = 'notes'), 12, 'Заметки о консервации и солении.', 'Заметки о консервации', 'заметки, консервация, соление', 'Заметки о консервации и солении.');

-- =====================================================================
-- Перенос статей: обновляем первичную категорию (articles.category).
-- =====================================================================

-- Соленья и маринады (soleniya-i-marinady)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'soleniya-i-marinady')
WHERE alias IN ('appetitnaya-kapusta-byistrogo-marinovaniya','cabbage-day-marinating','cabbage-plushka','cabbage-quick-pickling-vegetables','cucumber-slices-in-a-spicy-oil-marinade','kapusta-marinovannaya-s-percem-morkovьyu-i-chesnokom','pepper-in-the-marinade','pickles-with-ketchup','preserved-cucumbers-with-citric-acid','recept-domashnih-hrustyashie-konservirovannyh-ogurcov','crunchy-canned-pickles','eggplant-in-bulgarian');

-- Салаты на зиму (salaty-na-zimu)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'salaty-na-zimu')
WHERE alias IN ('bean-salad-and-greens','lazy-spark','ostryj-salat-iz-patisson-po-korejski','salad-dozen','salad-for-the-winter-with-cabbage','salad-of-red-beet','salad-of-zucchini','salad-with-cabbage-for-the-winter','salad-with-eggplant-for-the-winter','salat-iz-zelenyix-pomidor-na-zimu','zagotovki-na-zimu-salat-iz-patisson-i-ovoshej','pickled-vegetables-assorti');

-- Овощная икра (ovoshhnaya-ikra)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'ovoshhnaya-ikra')
WHERE alias IN ('eggs-from-the-little-blue','ikra-iz-baklazhan-i-ovoshej-vkusnaya-i-appetitnaya','squash-caviar-for-the-winter','appetizer-of-eggplant-and-onion');

-- Соусы и приправы (sousy-i-pripravy)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-pripravy')
WHERE alias IN ('chicken-with-apples','prostoj-recept-domashnego-ketchupa');

-- Консервированные овощи (konservirovannye-ovoshhi)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'konservirovannye-ovoshhi')
WHERE alias IN ('canned-peas','canned-sorrel','canned-tomatoes-with-onions-and-red-beets','fresh-tomatoes','peppers-for-winter','zucchini-ukrainian');

-- Сушка (sushka)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'sushka')
WHERE alias IN ('chesnok-sushim-v-duhovke-v-domashnih-usloviyah');

-- Заметка о консервации (zametki-o-konservacii)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zametki-o-konservacii')
WHERE alias IN ('on-preserving-and-pickling');

-- =====================================================================
-- Обновляем записи членства: у перенесённых статей меняем членство
-- в старой категории "conservation" на новую первичную категорию (sort 0).
-- =====================================================================
UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'soleniya-i-marinady')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'conservation')
  AND a.alias IN ('appetitnaya-kapusta-byistrogo-marinovaniya','cabbage-day-marinating','cabbage-plushka','cabbage-quick-pickling-vegetables','cucumber-slices-in-a-spicy-oil-marinade','kapusta-marinovannaya-s-percem-morkovьyu-i-chesnokom','pepper-in-the-marinade','pickles-with-ketchup','preserved-cucumbers-with-citric-acid','recept-domashnih-hrustyashie-konservirovannyh-ogurcov','crunchy-canned-pickles','eggplant-in-bulgarian');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'salaty-na-zimu')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'conservation')
  AND a.alias IN ('bean-salad-and-greens','lazy-spark','ostryj-salat-iz-patisson-po-korejski','salad-dozen','salad-for-the-winter-with-cabbage','salad-of-red-beet','salad-of-zucchini','salad-with-cabbage-for-the-winter','salad-with-eggplant-for-the-winter','salat-iz-zelenyix-pomidor-na-zimu','zagotovki-na-zimu-salat-iz-patisson-i-ovoshej','pickled-vegetables-assorti');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'ovoshhnaya-ikra')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'conservation')
  AND a.alias IN ('eggs-from-the-little-blue','ikra-iz-baklazhan-i-ovoshej-vkusnaya-i-appetitnaya','squash-caviar-for-the-winter','appetizer-of-eggplant-and-onion');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-pripravy')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'conservation')
  AND a.alias IN ('chicken-with-apples','prostoj-recept-domashnego-ketchupa');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'konservirovannye-ovoshhi')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'conservation')
  AND a.alias IN ('canned-peas','canned-sorrel','canned-tomatoes-with-onions-and-red-beets','fresh-tomatoes','peppers-for-winter','zucchini-ukrainian');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'sushka')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'conservation')
  AND a.alias IN ('chesnok-sushim-v-duhovke-v-domashnih-usloviyah');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zametki-o-konservacii')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'conservation')
  AND a.alias IN ('on-preserving-and-pickling');

-- =====================================================================
-- Удаляем теперь пустую категорию "conservation".
-- =====================================================================
DELETE FROM categories WHERE alias = 'conservation';