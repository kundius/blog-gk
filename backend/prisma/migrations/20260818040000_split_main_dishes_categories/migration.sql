-- Разбиение категории "main-dishes" (Вторые блюда) на специализированные
-- подкатегории и перенос в существующие категории раздела "Вторые блюда".

-- 1. Новые подкатегории под разделом "Вторые блюда" (second-courses).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Вареники и пельмени', 'vareniki-i-pelmeni', (SELECT id FROM categories WHERE alias = 'second-courses'), 7, 'Вареники и пельмени: с творогом, ягодами, мясом и овощами.', 'Вареники и пельмени — рецепты', 'вареники, пельмени, рецепты', 'Вареники и пельмени: с творогом, ягодами, мясом и овощами.'),
  (gen_random_uuid(), 'Запеканки и макароны', 'zapekanki-i-makarony', (SELECT id FROM categories WHERE alias = 'second-courses'), 8, 'Запеканки и блюда из макаронных изделий.', 'Запеканки и макароны — рецепты', 'запеканки, макароны, рецепты', 'Запеканки и блюда из макаронных изделий.');

-- =====================================================================
-- Перенос статей: обновляем первичную категорию (articles.category) и
-- соответствующую запись членства в articles_categories (sort 0).
-- =====================================================================

-- Вареники и пельмени (vareniki-i-pelmeni)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'vareniki-i-pelmeni')
WHERE alias IN ('vareniki-na-kefire-s-zhimolostyu-na-paru','dumplings-with-halva','vareniki-s-klubnikoj-prigotovlennye-na-paru','dumplings-with-cottage-cheese','dumplings-with-cherries','vozdushnye-vareniki-s-zharenoj-kvashenoj-kapustoj-prigotovlennye-na-paru','dumplings-with-cabbage','parovyie-vareniki-s-vishnej','prostoj-recept-varenikov-s-tvorogom-vkusnye-i-appetitnye','lazy-dumplings','dumplings-with-mushroom-and-potato-stuffing','vareniki-s-kurinym-myasom-i-zharenym-lukom','domashnie-pelmeni-vkusno-i-appetitno','fried-dumplings-with-egg-dough','dumplings','prostoj-recept-pelmenej-so-svininoj-iz-zavarnogo-testa','lenivye-belyashi-prosto-i-vkusno');

-- Запеканки и макароны (zapekanki-i-makarony)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zapekanki-i-makarony')
WHERE alias IN ('vkusnaya-zapekanka-iz-makaron-i-tvoroga','zapekanka-iz-makaron-s-tvorogom-izyumom-i-vishnej-prosto-i-vkusno','prostoj-recept-makaronnyh-izdelij-s-tvorogom-i-izyumom','zapekanka-iz-makaronnyh-izdelij-s-yajcami-i-molokom','macaroni-and-cheese');

-- Мясные блюда (mjasnye-bljuda)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'mjasnye-bljuda')
WHERE alias IN ('appetitnye-syrnye-blinchiki-s-myasnoj-nachinkoj','buryj-ris-s-myasom-v-multivarke','grechnevaya-kasha-s-ovoshami-i-file-prostoe-i-vkusnoe-blyudo','kinoa-s-myasom-i-ovoshami-polezno-i-sytno','pilaf','pshenichnaya-kasha-s-myasom-prosto-i-vkusno','rice-patties','chechevicza-tushyonaya-s-ovoshhami-i-file','makaronnaya-zapekanka-s-kuricej-syrom-i-pomidorami','makaronnye-gnyozda-s-myasom-i-syrom-v-souse','makaronnye-gnyozda-s-farshem-i-syrom-na-skovorode','makaronyi-s-farshem-i-lukom','prostoj-recept-makaronnyh-izdelij-s-myasom-syrom-i-lukom-vkusno-i-appetitno','spagetti-iz-grechnevoj-muki-s-myasom-i-ovoshami','zapekanka-ziti-iz-myasnymi-sharikami-syrom-i-protertymi-pomidorami');

-- Овощные блюда (ovoshhnye-bljuda)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'ovoshhnye-bljuda')
WHERE alias IN ('kabachki-farshirovannyie-risom-s-farshem','stuffed-peppers','chesnochnye-strelki-s-myasom-i-ovoshami-tushenye-v-soevom-souse-vkusnye-i-appetitnye','chechevica-tushenaya-s-ovoshami-polezno-i-vkusno');

-- Завтраки (zavtraki) - раздел "Салаты и Закуски"
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zavtraki')
WHERE alias IN ('delicious-breakfast','omelette','scrambled-eggs-with-asparagus');

-- Бутерброды (buterbrody) - раздел "Салаты и Закуски"
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'buterbrody')
WHERE alias IN ('hot-appetizer');

-- Соусы и заправки (sousy-i-zagotovki) - раздел "Салаты и Закуски"
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-zagotovki')
WHERE alias IN ('sous-smetannyj-s-syrom-i-kolbasoj-k-makaronam');

-- =====================================================================
-- Обновляем записи членства: у перенесённых статей меняем членство
-- в старой категории "main-dishes" на новую первичную категорию (sort 0).
-- =====================================================================
UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'vareniki-i-pelmeni')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('vareniki-na-kefire-s-zhimolostyu-na-paru','dumplings-with-halva','vareniki-s-klubnikoj-prigotovlennye-na-paru','dumplings-with-cottage-cheese','dumplings-with-cherries','vozdushnye-vareniki-s-zharenoj-kvashenoj-kapustoj-prigotovlennye-na-paru','dumplings-with-cabbage','parovyie-vareniki-s-vishnej','prostoj-recept-varenikov-s-tvorogom-vkusnye-i-appetitnye','lazy-dumplings','dumplings-with-mushroom-and-potato-stuffing','vareniki-s-kurinym-myasom-i-zharenym-lukom','domashnie-pelmeni-vkusno-i-appetitno','fried-dumplings-with-egg-dough','dumplings','prostoj-recept-pelmenej-so-svininoj-iz-zavarnogo-testa','lenivye-belyashi-prosto-i-vkusno')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'main-dishes');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zapekanki-i-makarony')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('vkusnaya-zapekanka-iz-makaron-i-tvoroga','zapekanka-iz-makaron-s-tvorogom-izyumom-i-vishnej-prosto-i-vkusno','prostoj-recept-makaronnyh-izdelij-s-tvorogom-i-izyumom','zapekanka-iz-makaronnyh-izdelij-s-yajcami-i-molokom','macaroni-and-cheese')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'main-dishes');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'mjasnye-bljuda')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('appetitnye-syrnye-blinchiki-s-myasnoj-nachinkoj','buryj-ris-s-myasom-v-multivarke','grechnevaya-kasha-s-ovoshami-i-file-prostoe-i-vkusnoe-blyudo','kinoa-s-myasom-i-ovoshami-polezno-i-sytno','pilaf','pshenichnaya-kasha-s-myasom-prosto-i-vkusno','rice-patties','chechevicza-tushyonaya-s-ovoshhami-i-file','makaronnaya-zapekanka-s-kuricej-syrom-i-pomidorami','makaronnye-gnyozda-s-myasom-i-syrom-v-souse','makaronnye-gnyozda-s-farshem-i-syrom-na-skovorode','makaronyi-s-farshem-i-lukom','prostoj-recept-makaronnyh-izdelij-s-myasom-syrom-i-lukom-vkusno-i-appetitno','spagetti-iz-grechnevoj-muki-s-myasom-i-ovoshami','zapekanka-ziti-iz-myasnymi-sharikami-syrom-i-protertymi-pomidorami')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'main-dishes');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'ovoshhnye-bljuda')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('kabachki-farshirovannyie-risom-s-farshem','stuffed-peppers','chesnochnye-strelki-s-myasom-i-ovoshami-tushenye-v-soevom-souse-vkusnye-i-appetitnye','chechevica-tushenaya-s-ovoshami-polezno-i-vkusno')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'main-dishes');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zavtraki')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('delicious-breakfast','omelette','scrambled-eggs-with-asparagus')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'main-dishes');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'buterbrody')
FROM articles a
WHERE ac.article = a.id AND a.alias = 'hot-appetizer'
  AND ac.category = (SELECT id FROM categories WHERE alias = 'main-dishes');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-zagotovki')
FROM articles a
WHERE ac.article = a.id AND a.alias = 'sous-smetannyj-s-syrom-i-kolbasoj-k-makaronam'
  AND ac.category = (SELECT id FROM categories WHERE alias = 'main-dishes');

-- =====================================================================
-- Вторичные категории для пересекающихся блюд.
-- =====================================================================
INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'mjasnye-bljuda'), 1
FROM articles a
WHERE a.alias IN ('vareniki-s-kurinym-myasom-i-zharenym-lukom','domashnie-pelmeni-vkusno-i-appetitno','fried-dumplings-with-egg-dough','dumplings','prostoj-recept-pelmenej-so-svininoj-iz-zavarnogo-testa','lenivye-belyashi-prosto-i-vkusno','zapekanka-ziti-iz-myasnymi-sharikami-syrom-i-protertymi-pomidorami','makaronnaya-zapekanka-s-kuricej-syrom-i-pomidorami','makaronnye-gnyozda-s-myasom-i-syrom-v-souse','makaronnye-gnyozda-s-farshem-i-syrom-na-skovorode','makaronyi-s-farshem-i-lukom','prostoj-recept-makaronnyh-izdelij-s-myasom-syrom-i-lukom-vkusno-i-appetitno','spagetti-iz-grechnevoj-muki-s-myasom-i-ovoshami','stuffed-peppers','chesnochnye-strelki-s-myasom-i-ovoshami-tushenye-v-soevom-souse-vkusnye-i-appetitnye','chechevicza-tushyonaya-s-ovoshhami-i-file')
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'mjasnye-bljuda')
  );

INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'gribnye-blyuda'), 1
FROM articles a
WHERE a.alias = 'dumplings-with-mushroom-and-potato-stuffing'
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'gribnye-blyuda')
  );

INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'kartofelnye-bljuda'), 1
FROM articles a
WHERE a.alias = 'dumplings-with-mushroom-and-potato-stuffing'
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'kartofelnye-bljuda')
  );

INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'zapekanki-i-makarony'), 1
FROM articles a
WHERE a.alias IN ('makaronnaya-zapekanka-s-kuricej-syrom-i-pomidorami','makaronnye-gnyozda-s-myasom-i-syrom-v-souse','makaronnye-gnyozda-s-farshem-i-syrom-na-skovorode','makaronyi-s-farshem-i-lukom','prostoj-recept-makaronnyh-izdelij-s-myasom-syrom-i-lukom-vkusno-i-appetitno','spagetti-iz-grechnevoj-muki-s-myasom-i-ovoshami','zapekanka-ziti-iz-myasnymi-sharikami-syrom-i-protertymi-pomidorami')
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'zapekanki-i-makarony')
  );

-- =====================================================================
-- Удаляем теперь пустую категорию "main-dishes".
-- =====================================================================
DELETE FROM categories WHERE alias = 'main-dishes';