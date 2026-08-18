-- Разбиение категории "salads" (Салаты и закуски) на специализированные подкатегории.

-- 1. Переименовываем существующую категорию salads в "Салаты".
UPDATE categories
SET name = 'Салаты',
    content = 'Салаты: овощные, мясные, рыбные и праздничные.',
    seo_title = 'Салаты — рецепты',
    seo_keywords = 'салаты, овощные салаты, мясные салаты, рецепты',
    seo_description = 'Салаты: овощные, мясные, рыбные и праздничные рецепты.'
WHERE alias = 'salads';

-- 2. Новые подкатегории под разделом "Салаты и Закуски" (salaty-i-zakuski).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Закуски', 'zakuski', (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), 2, 'Закуски: яйца фаршированные, рулеты и закуски на праздничный стол.', 'Закуски — рецепты', 'закуски, рецепты', 'Закуски: яйца фаршированные, рулеты и закуски на праздничный стол.'),
  (gen_random_uuid(), 'Бутерброды и гренки', 'buterbrody', (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), 3, 'Бутерброды и гренки: горячие и на завтрак.', 'Бутерброды и гренки — рецепты', 'бутерброды, гренки, рецепты', 'Бутерброды и гренки: горячие и на завтрак.'),
  (gen_random_uuid(), 'Лаваш', 'lavash', (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), 4, 'Блюда из лаваша с разными начинками.', 'Блюда из лаваша — рецепты', 'лаваш, рецепты', 'Блюда из лаваша с разными начинками.'),
  (gen_random_uuid(), 'Завтраки и омлеты', 'zavtraki', (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), 5, 'Завтраки, омлеты и блюда из яиц.', 'Завтраки и омлеты — рецепты', 'завтраки, омлеты, яйца, рецепты', 'Завтраки, омлеты и блюда из яиц.'),
  (gen_random_uuid(), 'Паштеты и блюда из печени', 'pashtery', (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), 6, 'Паштеты и блюда из печени.', 'Паштеты и блюда из печени — рецепты', 'паштеты, печень, рецепты', 'Паштеты и блюда из печени.'),
  (gen_random_uuid(), 'Соусы и заправки', 'sousy-i-zagotovki', (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), 7, 'Домашние соусы, майонез, кетчуп и заправки.', 'Соусы и заправки — рецепты', 'соусы, заправки, майонез, кетчуп, рецепты', 'Домашние соусы, майонез, кетчуп и заправки.'),
  (gen_random_uuid(), 'Домашние сыры', 'domashnie-syry', (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), 8, 'Домашние сыры.', 'Домашние сыры — рецепты', 'домашний сыр, рецепты', 'Домашние сыры.');

-- 3. Новая подкатегория заметок под разделом "Заметки" (notes).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Заметки о салатах и закусках', 'zametki-o-salatakh', (SELECT id FROM categories WHERE alias = 'notes'), 11, 'Заметки о салатах и закусках.', 'Заметки о салатах и закусках', 'заметки, салаты, закуски', 'Заметки о салатах и закусках.');

-- =====================================================================
-- Перенос статей: обновляем первичную категорию (articles.category) и
-- соответствующую запись членства в articles_categories (sort 0).
-- =====================================================================

-- Закуски (zakuski)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zakuski')
WHERE alias IN ('delicious-snacks','velikolepnaya-zakuska-iz-kabachkov-s-farshem','zakuska-iz-yaichnyh-blinov-s-nachinkoj-prosto-i-vkusno','egg-roll-with-melted-smoked-cheese','eggs-stuffed-french','tort-vafelnyj-s-nachinkoj-iz-farsha-morkovi-i-gribov');

-- Бутерброды и гренки (buterbrody)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'buterbrody')
WHERE alias IN ('appetitnyie-grenki-so-shprotami-ogurczami-i-pomidorami-prosto-i-vkusno','buterbrody-na-skovorode-s-nachinkoj-v-yaichnom-klyare','buterbrody-s-kurinym-pashtetom-vkusno-i-sytno','buterbrody-s-pashtetom-iz-kurinoj-pecheni-i-zelenyu','bystryj-vkusnyj-zavtrak-buterbrody-s-nachinkoj-v-yaichnom-klyare','vkusnyie-i-appetitnyie-goryachie-buterbrodyi-s-syirom-i-pomidorami','goryachie-buterbrody-v-duhovke-vkusno-i-bystro','vtrak-ne-tolko-bystro-no-i-vkusno','goryachie-buterbrody-na-zavtrak-prosto-i-vkusno','goryachie-buterbrody-s-kurinym-myasom-i-syrom-sytnye-i-appetitnye','prostoj-recept-goryachih-buterbrodov-iz-krabovymi-palochkami-i-syrom');

-- Лаваш (lavash)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'lavash')
WHERE alias IN ('vkusnaya-zakuska-iz-lavasha-kurinogo-file-i-syra-na-skovorode','lavash-s-myasnoj-nachinkoj-v-klyare-na-skovorode','lavash-s-myasnoj-nachinkoj-na-skovorode-vkusnyj-i-appetitnyj','lavash-s-nachinkoj-iz-myasa-yaic-i-morkovi','lavash-s-nachinkoj-iz-syra-ovoshej-i-myasa-prosto-i-vkusno','prostoj-i-bystryj-recept-lavasha-s-plavlenym-syrom-i-yajcami-vkusno-i-sytno');

-- Завтраки и омлеты (zavtraki)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zavtraki')
WHERE alias IN ('vkusnyj-zavtrak-v-duhovke-ili-na-skovorode-iz-yaic-tvoroga-i-syra','vkusnyj-zavtrak-iz-yaic-tvoroga-pomidorov-i-kolbasy-ili-vetchiny','vkusnyj-i-appetitnyj-zavtrak-iz-vetchinyi-i-syra-v-klyare','vkusnyj-i-appetitnyj-zavtrak-iz-omleta-chesnochnyh-strelok-i-syra','vkusnyj-i-sytnyj-zavtrak-ili-uzhin','nezhnyj-yaichnyj-omlet-s-syrom-na-skovorode','omlet-iz-yaic-na-vodyanoj-bane','omlet-s-shampinonami-i-zharenym-lukom-vkusnyj-i-sytnyj-zavtrak');

-- Паштеты и блюда из печени (pashtery)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'pashtery')
WHERE alias IN ('bliny-iz-pecheni-s-gribnoj-nachinkoj-vkusnye-i-sytnye','pashtet-iz-kurinoj-pecheni-vkusno-i-prosto','liver-pate','pashtet-iz-svinoj-pecheni-vkusno-i-sytno','prostoj-recept-torta-iz-pecheni-syra-luka-i-morkovi');

-- Соусы и заправки (sousy-i-zagotovki)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-zagotovki')
WHERE alias IN ('domashnij-majonez-na-varenyh-zheltkah','homemade-ketchup','zapravki-iz-hrena-s-uksusom-svekloj-i-s-majonezom');

-- Домашние сыры (domashnie-syry)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'domashnie-syry')
WHERE alias IN ('adygejskij-domashnij-syr-na-syvorotke-prosto-i-vkusno','homemade-dutch-cheese','domashnij-syr-k-chayu-prosto-i-bystro','recept-domashnego-syra-prosto-i-vkusno');

-- Овощные блюда (ovoshhnye-bljuda) - раздел "Вторые блюда"
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'ovoshhnye-bljuda')
WHERE alias IN ('baklazhany-v-yaichnom-klyare-i-panirovochnyh-suharyah-s-ovoshami','baklazhany-po-kubanski-vkusnye-i-appetitnye','baklazhany-s-lukom-i-morkovyu-tushenye-na-skovorode','baklazhany-s-lukom-tushennye-v-smetane','baklazhany-s-pomidorami-i-syrom-zapechennye-v-duhovke','baklazhany-tushenye-v-smetane-prosto-i-vkusno','kabachki-v-klyare-s-tverdym-syrom','kabachki-v-klyare-syitno-i-vkusno','kabachki-zharenye-s-chesnokom-majonezom-i-ukropom','kabachki-farshirovannye-myasnym-farshem-lukom-morkovyu-i-syrom','squash-caviar','kabachkovye-lepeshki-s-syrom-i-mannoj-krupoj-zapechennye-v-duhovke','kabachkovyie-oladi-s-farshem-nezhnyie-i-syitnyie','zapekanka-iz-kabachkov-file-syra-i-pomidorov','kapusta-brokkoli-zharenaya-v-klyare-iz-yaic-prosto-i-vkusno','kapusta-tushenaya-s-baklazhanami-i-ovoshhami','kapustnyie-oladi-vkusno-i-prosto','ovoshnye-kotlety-s-ovsyanoj-krupoj-vkusnye-i-sytnye','prostoj-recept-ovoshnyh-oladij-iz-patisson-prosto-i-vkusno','cvetnaya-kapusta-v-klyare-prosto-i-vkusno','zharenye-ostrye-chesnochnye-strelki-s-morkovyu-i-lukom','chesnochnye-strelki-tushenye-s-ovoshami-prosto-i-vkusno');

-- Консервация (conservation) - раздел "Заготовки"
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'conservation')
WHERE alias IN ('kapusta-marinovannaya-s-percem-morkovьyu-i-chesnokom','chesnok-sushim-v-duhovke-v-domashnih-usloviyah');

-- Заметки о салатах и закусках (zametki-o-salatakh)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zametki-o-salatakh')
WHERE alias = 'the-history-of-the-salad';

-- =====================================================================
-- Обновляем записи членства: у перенесённых статей меняем членство
-- в старой категории "salads" на новую первичную категорию (sort 0).
-- =====================================================================
UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zakuski')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('delicious-snacks','velikolepnaya-zakuska-iz-kabachkov-s-farshem','zakuska-iz-yaichnyh-blinov-s-nachinkoj-prosto-i-vkusno','egg-roll-with-melted-smoked-cheese','eggs-stuffed-french','tort-vafelnyj-s-nachinkoj-iz-farsha-morkovi-i-gribov')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'buterbrody')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('appetitnyie-grenki-so-shprotami-ogurczami-i-pomidorami-prosto-i-vkusno','buterbrody-na-skovorode-s-nachinkoj-v-yaichnom-klyare','buterbrody-s-kurinym-pashtetom-vkusno-i-sytno','buterbrody-s-pashtetom-iz-kurinoj-pecheni-i-zelenyu','bystryj-vkusnyj-zavtrak-buterbrody-s-nachinkoj-v-yaichnom-klyare','vkusnyie-i-appetitnyie-goryachie-buterbrodyi-s-syirom-i-pomidorami','goryachie-buterbrody-v-duhovke-vkusno-i-bystro','vtrak-ne-tolko-bystro-no-i-vkusno','goryachie-buterbrody-na-zavtrak-prosto-i-vkusno','goryachie-buterbrody-s-kurinym-myasom-i-syrom-sytnye-i-appetitnye','prostoj-recept-goryachih-buterbrodov-iz-krabovymi-palochkami-i-syrom')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'lavash')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('vkusnaya-zakuska-iz-lavasha-kurinogo-file-i-syra-na-skovorode','lavash-s-myasnoj-nachinkoj-v-klyare-na-skovorode','lavash-s-myasnoj-nachinkoj-na-skovorode-vkusnyj-i-appetitnyj','lavash-s-nachinkoj-iz-myasa-yaic-i-morkovi','lavash-s-nachinkoj-iz-syra-ovoshej-i-myasa-prosto-i-vkusno','prostoj-i-bystryj-recept-lavasha-s-plavlenym-syrom-i-yajcami-vkusno-i-sytno')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zavtraki')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('vkusnyj-zavtrak-v-duhovke-ili-na-skovorode-iz-yaic-tvoroga-i-syra','vkusnyj-zavtrak-iz-yaic-tvoroga-pomidorov-i-kolbasy-ili-vetchiny','vkusnyj-i-appetitnyj-zavtrak-iz-vetchinyi-i-syra-v-klyare','vkusnyj-i-appetitnyj-zavtrak-iz-omleta-chesnochnyh-strelok-i-syra','vkusnyj-i-sytnyj-zavtrak-ili-uzhin','nezhnyj-yaichnyj-omlet-s-syrom-na-skovorode','omlet-iz-yaic-na-vodyanoj-bane','omlet-s-shampinonami-i-zharenym-lukom-vkusnyj-i-sytnyj-zavtrak')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'pashtery')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('bliny-iz-pecheni-s-gribnoj-nachinkoj-vkusnye-i-sytnye','pashtet-iz-kurinoj-pecheni-vkusno-i-prosto','liver-pate','pashtet-iz-svinoj-pecheni-vkusno-i-sytno','prostoj-recept-torta-iz-pecheni-syra-luka-i-morkovi')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-zagotovki')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('domashnij-majonez-na-varenyh-zheltkah','homemade-ketchup','zapravki-iz-hrena-s-uksusom-svekloj-i-s-majonezom')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'domashnie-syry')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('adygejskij-domashnij-syr-na-syvorotke-prosto-i-vkusno','homemade-dutch-cheese','domashnij-syr-k-chayu-prosto-i-bystro','recept-domashnego-syra-prosto-i-vkusno')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'ovoshhnye-bljuda')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('baklazhany-v-yaichnom-klyare-i-panirovochnyh-suharyah-s-ovoshami','baklazhany-po-kubanski-vkusnye-i-appetitnye','baklazhany-s-lukom-i-morkovyu-tushenye-na-skovorode','baklazhany-s-lukom-tushennye-v-smetane','baklazhany-s-pomidorami-i-syrom-zapechennye-v-duhovke','baklazhany-tushenye-v-smetane-prosto-i-vkusno','kabachki-v-klyare-s-tverdym-syrom','kabachki-v-klyare-syitno-i-vkusno','kabachki-zharenye-s-chesnokom-majonezom-i-ukropom','kabachki-farshirovannye-myasnym-farshem-lukom-morkovyu-i-syrom','squash-caviar','kabachkovye-lepeshki-s-syrom-i-mannoj-krupoj-zapechennye-v-duhovke','kabachkovyie-oladi-s-farshem-nezhnyie-i-syitnyie','zapekanka-iz-kabachkov-file-syra-i-pomidorov','kapusta-brokkoli-zharenaya-v-klyare-iz-yaic-prosto-i-vkusno','kapusta-tushenaya-s-baklazhanami-i-ovoshhami','kapustnyie-oladi-vkusno-i-prosto','ovoshnye-kotlety-s-ovsyanoj-krupoj-vkusnye-i-sytnye','prostoj-recept-ovoshnyh-oladij-iz-patisson-prosto-i-vkusno','cvetnaya-kapusta-v-klyare-prosto-i-vkusno','zharenye-ostrye-chesnochnye-strelki-s-morkovyu-i-lukom','chesnochnye-strelki-tushenye-s-ovoshami-prosto-i-vkusno')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'conservation')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('kapusta-marinovannaya-s-percem-morkovьyu-i-chesnokom','chesnok-sushim-v-duhovke-v-domashnih-usloviyah')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zametki-o-salatakh')
FROM articles a
WHERE ac.article = a.id AND a.alias = 'the-history-of-the-salad'
  AND ac.category = (SELECT id FROM categories WHERE alias = 'salads');

-- =====================================================================
-- Вторичные категории для салатов (остаются в salads как первичной).
-- =====================================================================
INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'mjasnye-bljuda'), 1
FROM articles a
WHERE a.alias IN ('salat-vkusnyj-i-sytnyj-iz-myasa-ogurcov-i-yaichnyh-blinov','salat-iz-kurinogo-myasa-redki-i-zharenogo-luka-sytnyj-i-vkusnyj','salat-iz-kurinogo-myasa-svekly-i-ovoshej-poleznyj-i-sytnyj','salat-iz-redki-kurinogo-file-i-yaic-vkusnyj-i-sytnyj','salad-with-chicken-meat','salat-s-myasom-zelenym-goroshkom-i-suharikami','salat-iz-fasoli-s-myasom-ovoshami-i-yajcami','salat-iz-fasoli-kurinogo-file-i-zharennogo-luka')
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'mjasnye-bljuda')
  );

INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'fish-dishes'), 1
FROM articles a
WHERE a.alias IN ('kartofelьnyj-salat-s-ryboj-prosto-i-vkusno','salat-iz-kopchenoj-shuki-kartofelya-i-drugih-ingredientov','salat-iz-ryby-morkovi-i-luka','salat-seld-pod-shuboj-vkusno-i-sytno')
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'fish-dishes')
  );