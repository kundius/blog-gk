-- Объединение категорий "vareniki-i-pelmeni" (Вареники и пельмени) и
-- "zapekanki-i-makarony" (Запеканки и макароны) в одну категорию
-- "Домашняя классика" под разделом "Вторые блюда" (second-courses).

-- 1. Новая категория под разделом "Вторые блюда" (second-courses).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Домашняя классика', 'domashnyaya-klassika', (SELECT id FROM categories WHERE alias = 'second-courses'), 7, 'Вареники, пельмени, запеканки и блюда из макарон.', 'Домашняя классика — рецепты', 'вареники, пельмени, запеканки, макароны, рецепты', 'Вареники, пельмени, запеканки и блюда из макарон.');

-- =====================================================================
-- Перенос статей: обновляем первичную категорию (articles.category).
-- =====================================================================

-- Вареники и пельмени (vareniki-i-pelmeni)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'domashnyaya-klassika')
WHERE alias IN ('domashnie-pelmeni-vkusno-i-appetitno','dumplings','dumplings-with-cabbage','dumplings-with-cherries','dumplings-with-cottage-cheese','dumplings-with-halva','dumplings-with-mushroom-and-potato-stuffing','fried-dumplings-with-egg-dough','lazy-dumplings','lenivye-belyashi-prosto-i-vkusno','parovyie-vareniki-s-vishnej','prostoj-recept-pelmenej-so-svininoj-iz-zavarnogo-testa','prostoj-recept-varenikov-s-tvorogom-vkusnye-i-appetitnye','vareniki-na-kefire-s-zhimolostyu-na-paru','vareniki-s-klubnikoj-prigotovlennye-na-paru','vareniki-s-kurinym-myasom-i-zharenym-lukom','vozdushnye-vareniki-s-zharenoj-kvashenoj-kapustoj-prigotovlennye-na-paru');

-- Запеканки и макароны (zapekanki-i-makarony)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'domashnyaya-klassika')
WHERE alias IN ('macaroni-and-cheese','prostoj-recept-makaronnyh-izdelij-s-tvorogom-i-izyumom','vkusnaya-zapekanka-iz-makaron-i-tvoroga','zapekanka-iz-makaron-s-tvorogom-izyumom-i-vishnej-prosto-i-vkusno','zapekanka-iz-makaronnyh-izdelij-s-yajcami-i-molokom');

-- =====================================================================
-- Обновляем все записи членства в старой категории "vareniki-i-pelmeni"
-- (только первичные, sort 0) на новую категорию.
-- =====================================================================
UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'domashnyaya-klassika')
WHERE ac.category = (SELECT id FROM categories WHERE alias = 'vareniki-i-pelmeni');

-- Обновляем все записи членства в старой категории "zapekanki-i-makarony"
-- (первичные sort 0 и вторичные sort 1) на новую категорию.
UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'domashnyaya-klassika')
WHERE ac.category = (SELECT id FROM categories WHERE alias = 'zapekanki-i-makarony');

-- =====================================================================
-- Удаляем теперь пустые категории.
-- =====================================================================
DELETE FROM categories WHERE alias IN ('vareniki-i-pelmeni','zapekanki-i-makarony');