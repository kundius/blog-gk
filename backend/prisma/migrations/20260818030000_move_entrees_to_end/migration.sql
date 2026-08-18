-- Переносим категорию "entrees" (Прочие супы) в конец списка подкатегорий
-- раздела "Первые блюда" (first-courses). Остальные сортировки не меняются.
UPDATE categories
SET sort = 7
WHERE alias = 'entrees';