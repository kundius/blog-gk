-- Меняем местами разделы «Выпечка» и «Салаты и Закуски» под «Кулинарией».
-- Было: first(1), second(2), salaty-i-zakuski(3), vypechka(4), sladkij-stol(5), zagotovki(6)
-- Стало: first(1), second(2), vypechka(3), salaty-i-zakuski(4), sladkij-stol(5), zagotovki(6)

UPDATE categories SET sort = 99 WHERE alias = 'vypechka';
UPDATE categories SET sort = 4  WHERE alias = 'salaty-i-zakuski';
UPDATE categories SET sort = 3  WHERE alias = 'vypechka';
