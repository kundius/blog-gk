-- Разбиение категории "drinks" (Напитки и десерты) на специализированные
-- подкатегории: напитки и различные группы десертов.

-- 1. Новые подкатегории под разделом "Десерты" (deserty).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Напитки', 'napitki', (SELECT id FROM categories WHERE alias = 'deserty'), 4, 'Компоты, морсы, лимонады и кисломолочные напитки.', 'Напитки — рецепты', 'компоты, морсы, лимонады, напитки, рецепты', 'Компоты, морсы, лимонады и кисломолочные напитки.'),
  (gen_random_uuid(), 'Домашние сладости', 'domashnie-sladosti', (SELECT id FROM categories WHERE alias = 'deserty'), 5, 'Мармелад, конфеты, пастила, цукаты и другие домашние сладости.', 'Домашние сладости — рецепты', 'мармелад, конфеты, пастила, цукаты, рецепты', 'Мармелад, конфеты, пастила, цукаты и другие домашние сладости.'),
  (gen_random_uuid(), 'Творожная пасха', 'tvorozhnaya-pasha', (SELECT id FROM categories WHERE alias = 'deserty'), 6, 'Творожная пасха с изюмом и цукатами.', 'Творожная пасха — рецепты', 'творожная пасха, рецепты', 'Творожная пасха с изюмом и цукатами.'),
  (gen_random_uuid(), 'Творожные десерты', 'tvorozhnye-deserty', (SELECT id FROM categories WHERE alias = 'deserty'), 7, 'Нежные десерты из творога и молока.', 'Творожные десерты — рецепты', 'творожные десерты, рецепты', 'Нежные десерты из творога и молока.'),
  (gen_random_uuid(), 'Желе и муссы', 'zhele-i-mussy', (SELECT id FROM categories WHERE alias = 'deserty'), 8, 'Желе и муссы из ягод и фруктов.', 'Желе и муссы — рецепты', 'желе, муссы, рецепты', 'Желе и муссы из ягод и фруктов.'),
  (gen_random_uuid(), 'Запечённые яблоки и тыква', 'zapechennye-yabloki-i-tykva', (SELECT id FROM categories WHERE alias = 'deserty'), 9, 'Запечённые яблоки и тыква с начинками.', 'Запечённые яблоки и тыква — рецепты', 'запечённые яблоки, запечённая тыква, рецепты', 'Запечённые яблоки и тыква с начинками.'),
  (gen_random_uuid(), 'Каши и плов', 'kashi-i-plov', (SELECT id FROM categories WHERE alias = 'deserty'), 10, 'Сладкие каши, плов и кутья.', 'Каши и плов — рецепты', 'каши, плов, кутья, рецепты', 'Сладкие каши, плов и кутья.');

-- 2. Переименовываем "Сладости" в разделе выпечки в "Сладкая выпечка".
UPDATE categories SET name = 'Сладкая выпечка'
WHERE alias = 'sladosti';

-- =====================================================================
-- Перенос статей: обновляем первичную категорию (articles.category).
-- =====================================================================

-- Напитки (napitki)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'napitki')
WHERE alias IN ('compote-from-fresh-apples-and-cherries','compote-from-klubnik','compote-from-plums','compote-of-dried-fruits','compote-of-fresh-apples-or-pears','stewed-prunes-and-dried-apricots','mors-iz-revenya-i-chernoj-smorodiny','morse-cranberry','prohladitelnyj-napitok-iz-revenya-i-klubniki','prohladitelnyj-napitok-s-rozoj-karkade-myatoj-i-limonom','fermented-baked-milk-homemade');

-- Домашние сладости (domashnie-sladosti)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'domashnie-sladosti')
WHERE alias IN ('apple-jam','marmalade-of-peaches','homemade-candy-with-coconut','figs-stuffed-with-chocolate','prunes-in-chocolate','prunes-in-batter','walnuts-in-caramel','sweet-sausage-with-nuts-and-raisins','cukaty-iz-limonnyh-ili-apelsinovyh-korok','domashnyaya-pastila-iz-yablok-i-yagod-v-elektrosushilke','protein-cookies','protein-cookies-with-coconut','popkorn-v-domashnih-usloviyah-v-skovorode','zapekanka-iz-makaron-s-tvorogom-i-chernoslivom','zapekanka-iz-makaron-tvoroga-izyuma-i-chernoj-smorodiny');

-- Творожная пасха (tvorozhnaya-pasha)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'tvorozhnaya-pasha')
WHERE alias IN ('cheesecake-easter-custard','chocolate-easter-torina','cottage-cheese-pasca','easter-cheese-finnish','easter-cheesecake-with-nuts','nezhnaya-aromatnaya-tvorozhnaya-pasha','nezhnaya-tvorozhnaya-pasha-s-cukatami-i-izyumom','tvorozhnaya-pasxa','tvorozhnaya-zavarnaya-pasha-nezhnaya-i-vkusnaya');

-- Творожные десерты (tvorozhnye-deserty)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'tvorozhnye-deserty')
WHERE alias IN ('desert-iz-tvoroga-i-izyuma-prosto-i-vkusno','desert-iz-tvoroga-izyuma-i-kuragi-nezhnyj-i-vkusnyj','desert-iz-tvoroga-izyuma-i-kuragi-v-shokoladnoj-glazuri','molochnyj-desert-s-shokoladom-vkusnyj-i-appetitnyj','vkusnyj-i-prostoj-desert','desert-iz-pechenya-sgushennogo-moloka-i-orehov','desert-iz-tykvy-vkusnyj-i-appetitnyj');

-- Желе и муссы (zhele-i-mussy)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zhele-i-mussy')
WHERE alias IN ('cherry-jelly','klubnichnoe-zhele-so-smetanoj-nezhnoe-i-vkusnoe','klubnichnyj-muss-iz-zhele-iz-paketika-i-zhelatina-poristyj-i-vozdushnyj','vkusnyj-apelsinovyj-desert-iz-zhele-i-tvoroga','vkusnyj-desert-iz-yablochnogo-zhele-i-limona','zhele-iz-yagod-klubniki-i-zhimolosti-nezhnoe-i-vkusnoe','zhele-iz-yagodnogo-pyure-i-yagod-klubniki');

-- Запечённые яблоки и тыква (zapechennye-yabloki-i-tykva)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'zapechennye-yabloki-i-tykva')
WHERE alias IN ('apples-stuffed-with-cottage-cheese','nezhnye-i-sochnye-zapechennye-yabloki-s-tvorogom-i-izyumom','vkusnyj-desert-iz-yablok-s-tvorogom-i-izyumom-zapechennyh-v-duhovke','vkusnyj-desert-zapechennye-yabloki-s-tvorogom-i-slivochnym-maslom','zapechennye-yabloki-s-vinogradom-v-duhovke','zapechennye-yabloki-so-slivami-v-duhovke-prosto-i-vkusno','tykva-s-limonom-i-saharom-zapechennaya-v-duhovke','zapechennaya-tykva-s-yablokami-vinogradom-i-yajcami-v-duhovke','zapechennaya-tykva-v-duhovke-s-saharom-ili-myodom-vkusno-i-polezno');

-- Каши и плов (kashi-i-plov)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'kashi-i-plov')
WHERE alias IN ('plov-s-tykvoj-i-fruktami-poleznyj-i-vkusnyj','prostoj-recept-tykvennoj-kashi-s-mannoj-krupoj-i-izyumom','prostoj-recept-tykvennoj-kashi-s-pshenom-izyumom-i-yagodami-maliny','pumpkin-porridge-with-millet','tykvennaya-kasha-s-pshenom-i-yablokami','tykvennaya-kasha-s-risom','kutya-iz-risa-i-suhofruktov','sladkaya-kutya-iz-grechki-meda-i-suhofruktov');

-- Пирожные → существующая категория cakes
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'cakes')
WHERE alias IN ('cake-potato','cakes-potato-sugar','cakes-potato-with-coconut','cakes-potato-with-condensed-milk','domashnie-pirozhnye-kartoshka-s-orehami-i-izyumom','domashnie-pirozhnye-«kartoshka»-vkusno-i-prosto','souffle-birds-milk');

-- Фруктовый суп → существующая категория entrees (Прочие супы)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'entrees')
WHERE alias IN ('fruktovyij-sup-s-suxofruktami-i-pshenom');

-- Сметана → существующая категория sousy-i-zagotovki (Соусы и заправки)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-zagotovki')
WHERE alias IN ('homemade-sour-cream');

-- =====================================================================
-- Обновляем записи членства: у перенесённых статей меняем членство
-- в старой категории "drinks" на новую первичную категорию (sort 0).
-- =====================================================================
UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'napitki')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('compote-from-fresh-apples-and-cherries','compote-from-klubnik','compote-from-plums','compote-of-dried-fruits','compote-of-fresh-apples-or-pears','stewed-prunes-and-dried-apricots','mors-iz-revenya-i-chernoj-smorodiny','morse-cranberry','prohladitelnyj-napitok-iz-revenya-i-klubniki','prohladitelnyj-napitok-s-rozoj-karkade-myatoj-i-limonom','fermented-baked-milk-homemade');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'domashnie-sladosti')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('apple-jam','marmalade-of-peaches','homemade-candy-with-coconut','figs-stuffed-with-chocolate','prunes-in-chocolate','prunes-in-batter','walnuts-in-caramel','sweet-sausage-with-nuts-and-raisins','cukaty-iz-limonnyh-ili-apelsinovyh-korok','domashnyaya-pastila-iz-yablok-i-yagod-v-elektrosushilke','protein-cookies','protein-cookies-with-coconut','popkorn-v-domashnih-usloviyah-v-skovorode','zapekanka-iz-makaron-s-tvorogom-i-chernoslivom','zapekanka-iz-makaron-tvoroga-izyuma-i-chernoj-smorodiny');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'tvorozhnaya-pasha')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('cheesecake-easter-custard','chocolate-easter-torina','cottage-cheese-pasca','easter-cheese-finnish','easter-cheesecake-with-nuts','nezhnaya-aromatnaya-tvorozhnaya-pasha','nezhnaya-tvorozhnaya-pasha-s-cukatami-i-izyumom','tvorozhnaya-pasxa','tvorozhnaya-zavarnaya-pasha-nezhnaya-i-vkusnaya');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'tvorozhnye-deserty')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('desert-iz-tvoroga-i-izyuma-prosto-i-vkusno','desert-iz-tvoroga-izyuma-i-kuragi-nezhnyj-i-vkusnyj','desert-iz-tvoroga-izyuma-i-kuragi-v-shokoladnoj-glazuri','molochnyj-desert-s-shokoladom-vkusnyj-i-appetitnyj','vkusnyj-i-prostoj-desert','desert-iz-pechenya-sgushennogo-moloka-i-orehov','desert-iz-tykvy-vkusnyj-i-appetitnyj');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zhele-i-mussy')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('cherry-jelly','klubnichnoe-zhele-so-smetanoj-nezhnoe-i-vkusnoe','klubnichnyj-muss-iz-zhele-iz-paketika-i-zhelatina-poristyj-i-vozdushnyj','vkusnyj-apelsinovyj-desert-iz-zhele-i-tvoroga','vkusnyj-desert-iz-yablochnogo-zhele-i-limona','zhele-iz-yagod-klubniki-i-zhimolosti-nezhnoe-i-vkusnoe','zhele-iz-yagodnogo-pyure-i-yagod-klubniki');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'zapechennye-yabloki-i-tykva')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('apples-stuffed-with-cottage-cheese','nezhnye-i-sochnye-zapechennye-yabloki-s-tvorogom-i-izyumom','vkusnyj-desert-iz-yablok-s-tvorogom-i-izyumom-zapechennyh-v-duhovke','vkusnyj-desert-zapechennye-yabloki-s-tvorogom-i-slivochnym-maslom','zapechennye-yabloki-s-vinogradom-v-duhovke','zapechennye-yabloki-so-slivami-v-duhovke-prosto-i-vkusno','tykva-s-limonom-i-saharom-zapechennaya-v-duhovke','zapechennaya-tykva-s-yablokami-vinogradom-i-yajcami-v-duhovke','zapechennaya-tykva-v-duhovke-s-saharom-ili-myodom-vkusno-i-polezno');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'kashi-i-plov')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('plov-s-tykvoj-i-fruktami-poleznyj-i-vkusnyj','prostoj-recept-tykvennoj-kashi-s-mannoj-krupoj-i-izyumom','prostoj-recept-tykvennoj-kashi-s-pshenom-izyumom-i-yagodami-maliny','pumpkin-porridge-with-millet','tykvennaya-kasha-s-pshenom-i-yablokami','tykvennaya-kasha-s-risom','kutya-iz-risa-i-suhofruktov','sladkaya-kutya-iz-grechki-meda-i-suhofruktov');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'cakes')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('cake-potato','cakes-potato-sugar','cakes-potato-with-coconut','cakes-potato-with-condensed-milk','domashnie-pirozhnye-kartoshka-s-orehami-i-izyumom','domashnie-pirozhnye-«kartoshka»-vkusno-i-prosto','souffle-birds-milk');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'entrees')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('fruktovyij-sup-s-suxofruktami-i-pshenom');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'sousy-i-zagotovki')
FROM articles a
WHERE ac.article = a.id AND ac.category = (SELECT id FROM categories WHERE alias = 'drinks')
  AND a.alias IN ('homemade-sour-cream');

-- =====================================================================
-- Удаляем теперь пустую категорию "drinks".
-- =====================================================================
DELETE FROM categories WHERE alias = 'drinks';