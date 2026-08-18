-- Разбиение категории "entrees" (Первые блюда) на специализированные подкатегории супов.

-- 1. Переименовываем существующую категорию entrees в "Супы" (общий бакет).
UPDATE categories
SET name = 'Супы',
    content = 'Супы: борщи, рассольники, грибные, бобовые, мясные и с крупами.',
    seo_title = 'Супы — рецепты',
    seo_keywords = 'супы, борщи, рассольники, рецепты',
    seo_description = 'Супы: борщи, рассольники, грибные, бобовые, мясные и с крупами.'
WHERE alias = 'entrees';

-- 2. Новые подкатегории под разделом "Первые блюда" (first-courses).
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description) VALUES
  (gen_random_uuid(), 'Борщи и рассольники', 'borshchi-i-rassolniki', (SELECT id FROM categories WHERE alias = 'first-courses'), 2, 'Борщи и рассольники.', 'Борщи и рассольники — рецепты', 'борщи, рассольники, рецепты', 'Борщи и рассольники.'),
  (gen_random_uuid(), 'Грибные и овощные супы', 'gribnye-i-ovoshhnye-supy', (SELECT id FROM categories WHERE alias = 'first-courses'), 3, 'Грибные и овощные супы.', 'Грибные и овощные супы — рецепты', 'грибные супы, овощные супы, рецепты', 'Грибные и овощные супы.'),
  (gen_random_uuid(), 'Супы из бобовых', 'supy-iz-bobovyh', (SELECT id FROM categories WHERE alias = 'first-courses'), 4, 'Супы из фасоли, гороха и чечевицы.', 'Супы из бобовых — рецепты', 'супы из бобовых, фасоль, горох, чечевица, рецепты', 'Супы из фасоли, гороха и чечевицы.'),
  (gen_random_uuid(), 'Супы с мясом и птицей', 'supy-s-myasom-i-pticej', (SELECT id FROM categories WHERE alias = 'first-courses'), 5, 'Супы с мясом, птицей, фрикадельками и клецками.', 'Супы с мясом и птицей — рецепты', 'супы с мясом, курицей, фрикадельками, рецепты', 'Супы с мясом, птицей, фрикадельками и клецками.'),
  (gen_random_uuid(), 'Супы с крупами и макаронами', 'krupyanye-supy', (SELECT id FROM categories WHERE alias = 'first-courses'), 6, 'Супы с гречкой, рисом, пшеном и макаронами.', 'Супы с крупами и макаронами — рецепты', 'супы с крупами, гречка, рис, пшено, макароны, рецепты', 'Супы с гречкой, рисом, пшеном и макаронами.');

-- =====================================================================
-- Перенос статей: обновляем первичную категорию (articles.category) и
-- соответствующую запись членства в articles_categories (sort 0).
-- =====================================================================

-- Борщи и рассольники (borshchi-i-rassolniki)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'borshchi-i-rassolniki')
WHERE alias IN ('green-soup','krasnyj-borsh-s-gribami-vkusnyj-i-sytnyj','red-borsch','prostoj-recept-krasnogo-borsha-prosto-i-vkusno','prostoj-recept-rassolnika-s-risom-i-solenymi-ogurcami','pickle');

-- Грибные и овощные супы (gribnye-i-ovoshhnye-supy)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'gribnye-i-ovoshhnye-supy')
WHERE alias IN ('prostoj-recept-kartofelnogo-gribnogo-supa','mushroom-soup','vegetable-soup-with-meatballs','sup-fasolevyj-s-gribami-vkusno-i-appetitno');

-- Супы из бобовых (supy-iz-bobovyh)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'supy-iz-bobovyh')
WHERE alias IN ('appetitnyij-fasolevyij-sup','sup-iz-checheviczyi','pea-soup-with-smoked','fasolevyj-sup-s-myasnymi-frikadelkami-i-svezhimi-pomidorami');

-- Супы с мясом и птицей (supy-s-myasom-i-pticej)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'supy-s-myasom-i-pticej')
WHERE alias IN ('soup-with-meatballs','sup-kartofelnyj-s-domashnimi-pelmenyami-iz-myasom-svininy','sup-kurinyj-s-syrnymi-sharikami-prosto-i-appetitno','kurinyj-sup-s-zelyonym-goroshkom','soup-with-sausage-finnish-recipe','zamechatelnyij-sup-s-kleczkami','soup-with-garlic-dumplings');

-- Супы с крупами и макаронами (krupyanye-supy)
UPDATE articles SET category = (SELECT id FROM categories WHERE alias = 'krupyanye-supy')
WHERE alias IN ('soup-with-pasta','sup-vermishelevyj-s-shampinonami-prosto-i-vkusno','sup-risovyj-s-shampinenami-i-protertymi-pomidorami','risovyj-sup-s-frikadelkami-i-pomidorami-pitatelnoe-i-sytnoe-blyudo','pshennyj-ostryj-sup-so-svininoj-i-zelenyu','recept-grechnevogo-supa-s-kurinymi-myasom','prostoj-recept-supa-s-frikadelkami-i-grechnevoj-lapshoj');

-- =====================================================================
-- Обновляем записи членства: у перенесённых статей меняем членство
-- в старой категории "entrees" на новую первичную категорию (sort 0).
-- =====================================================================
UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'borshchi-i-rassolniki')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('green-soup','krasnyj-borsh-s-gribami-vkusnyj-i-sytnyj','red-borsch','prostoj-recept-krasnogo-borsha-prosto-i-vkusno','prostoj-recept-rassolnika-s-risom-i-solenymi-ogurcami','pickle')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'entrees');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'gribnye-i-ovoshhnye-supy')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('prostoj-recept-kartofelnogo-gribnogo-supa','mushroom-soup','vegetable-soup-with-meatballs','sup-fasolevyj-s-gribami-vkusno-i-appetitno')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'entrees');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'supy-iz-bobovyh')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('appetitnyij-fasolevyij-sup','sup-iz-checheviczyi','pea-soup-with-smoked','fasolevyj-sup-s-myasnymi-frikadelkami-i-svezhimi-pomidorami')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'entrees');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'supy-s-myasom-i-pticej')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('soup-with-meatballs','sup-kartofelnyj-s-domashnimi-pelmenyami-iz-myasom-svininy','sup-kurinyj-s-syrnymi-sharikami-prosto-i-appetitno','kurinyj-sup-s-zelyonym-goroshkom','soup-with-sausage-finnish-recipe','zamechatelnyij-sup-s-kleczkami','soup-with-garlic-dumplings')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'entrees');

UPDATE articles_categories ac
SET category = (SELECT id FROM categories WHERE alias = 'krupyanye-supy')
FROM articles a
WHERE ac.article = a.id AND a.alias IN ('soup-with-pasta','sup-vermishelevyj-s-shampinonami-prosto-i-vkusno','sup-risovyj-s-shampinenami-i-protertymi-pomidorami','risovyj-sup-s-frikadelkami-i-pomidorami-pitatelnoe-i-sytnoe-blyudo','pshennyj-ostryj-sup-so-svininoj-i-zelenyu','recept-grechnevogo-supa-s-kurinymi-myasom','prostoj-recept-supa-s-frikadelkami-i-grechnevoj-lapshoj')
  AND ac.category = (SELECT id FROM categories WHERE alias = 'entrees');

-- =====================================================================
-- Вторичные категории для пересекающихся супов.
-- =====================================================================
INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'gribnye-i-ovoshhnye-supy'), 1
FROM articles a
WHERE a.alias IN ('sup-vermishelevyj-s-shampinonami-prosto-i-vkusno','sup-risovyj-s-shampinenami-i-protertymi-pomidorami','sup-fasolevyj-s-gribami-vkusno-i-appetitno')
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'gribnye-i-ovoshhnye-supy')
  );

INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'supy-s-myasom-i-pticej'), 1
FROM articles a
WHERE a.alias IN ('risovyj-sup-s-frikadelkami-i-pomidorami-pitatelnoe-i-sytnoe-blyudo','pshennyj-ostryj-sup-so-svininoj-i-zelenyu','recept-grechnevogo-supa-s-kurinymi-myasom','prostoj-recept-supa-s-frikadelkami-i-grechnevoj-lapshoj','fasolevyj-sup-s-myasnymi-frikadelkami-i-svezhimi-pomidorami','vegetable-soup-with-meatballs')
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'supy-s-myasom-i-pticej')
  );

INSERT INTO articles_categories (article, category, sort)
SELECT a.id, (SELECT id FROM categories WHERE alias = 'supy-iz-bobovyh'), 1
FROM articles a
WHERE a.alias IN ('kurinyj-sup-s-zelyonym-goroshkom','sup-fasolevyj-s-gribami-vkusno-i-appetitno')
  AND NOT EXISTS (
    SELECT 1 FROM articles_categories x
    WHERE x.article = a.id AND x.category = (SELECT id FROM categories WHERE alias = 'supy-iz-bobovyh')
  );