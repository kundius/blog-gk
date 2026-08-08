-- Реструктуризация кулинарии: 6 разделов-навигаторов с подкатегориями.
-- Существующие категории со статьями остаются листьями (URL и данные статей не меняются).

-- 1. Создаём разделы под «Кулинарией» (родитель cooking), sort 1..6
INSERT INTO categories (id, name, alias, parent, sort, content, seo_title, seo_keywords, seo_description)
VALUES
  (gen_random_uuid(), 'Первые блюда',     'first-courses',   (SELECT id FROM categories WHERE alias = 'cooking'), 1, 'Супы, борщи и бульоны.',                                  'Первые блюда — рецепты супов и бульонов', 'первые блюда, супы, бульоны, рецепты', 'Первые блюда: супы, борщи и бульоны.'),
  (gen_random_uuid(), 'Вторые блюда',     'second-courses',  (SELECT id FROM categories WHERE alias = 'cooking'), 2, 'Мясные, рыбные, овощные, грибные и картофельные блюда.', 'Вторые блюда — рецепты горячих блюд', 'вторые блюда, мясные, рыбные, овощные, рецепты', 'Вторые блюда: мясные, рыбные, овощные, грибные и картофельные.'),
  (gen_random_uuid(), 'Салаты и Закуски', 'salaty-i-zakuski',(SELECT id FROM categories WHERE alias = 'cooking'), 3, 'Салаты и закуски.',                                        'Салаты и закуски — рецепты', 'салаты, закуски, рецепты', 'Салаты и закуски.'),
  (gen_random_uuid(), 'Выпечка',          'vypechka',        (SELECT id FROM categories WHERE alias = 'cooking'), 4, 'Пироги, печенье и несладкая выпечка.',                    'Выпечка — рецепты пирогов и печенья', 'выпечка, пироги, печенье, рецепты', 'Выпечка: пироги, печенье и несладкая выпечка.'),
  (gen_random_uuid(), 'Сладкий стол',     'sladkij-stol',    (SELECT id FROM categories WHERE alias = 'cooking'), 5, 'Торты, пирожные, десерты, кремы и напитки.',              'Сладкий стол — рецепты тортов и десертов', 'сладкий стол, торты, пирожные, десерты, кремы, рецепты', 'Сладкий стол: торты и пирожные, напитки и десерты, кремы и глазурь.'),
  (gen_random_uuid(), 'Заготовки',        'zagotovki',       (SELECT id FROM categories WHERE alias = 'cooking'), 6, 'Консервация и заготовки.',                                'Заготовки — рецепты консервации', 'заготовки, консервация, рецепты', 'Заготовки: консервация на зиму.');

-- 2. Первые блюда → first-courses
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'first-courses'), sort = 1 WHERE alias = 'entrees';

-- 3. Вторые блюда → second-courses (порядок: Мясные, Рыбные, Овощные, Грибные, Картофельные, Вторые блюда (общее))
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'second-courses'), sort = 1 WHERE alias = 'mjasnye-bljuda';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'second-courses'), sort = 2 WHERE alias = 'fish-dishes';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'second-courses'), sort = 3 WHERE alias = 'ovoshhnye-bljuda';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'second-courses'), sort = 4 WHERE alias = 'gribnye-blyuda';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'second-courses'), sort = 5 WHERE alias = 'kartofelnye-bljuda';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'second-courses'), sort = 6 WHERE alias = 'main-dishes';

-- 4. Салаты и Закуски → salaty-i-zakuski
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'salaty-i-zakuski'), sort = 1 WHERE alias = 'salads';

-- 5. Выпечка → vypechka (Пироги, Печенье, Выпечка (несладкая))
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'vypechka'), sort = 1 WHERE alias = 'pirogi';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'vypechka'), sort = 2 WHERE alias = 'cookies';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'vypechka'), sort = 3 WHERE alias = 'baking';

-- 6. Сладкий стол → sladkij-stol (Торты и пирожные, Напитки и десерты, Крем и глазурь)
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'sladkij-stol'), sort = 1 WHERE alias = 'cakes';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'sladkij-stol'), sort = 2 WHERE alias = 'drinks';
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'sladkij-stol'), sort = 3 WHERE alias = 'krem-i-glazur-dlya-tortov';

-- 7. Заготовки → zagotovki
UPDATE categories SET parent = (SELECT id FROM categories WHERE alias = 'zagotovki'), sort = 1 WHERE alias = 'conservation';
