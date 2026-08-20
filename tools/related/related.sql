BEGIN;
DELETE FROM articles_related;
INSERT INTO articles_related ("article", "related_article", "sort") VALUES
('8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, '98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, 1),
('8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, 'ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, 2),
('8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, '60551769-57f3-4dbd-9314-1044e806aafb'::uuid, 3),
('8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, '7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, 4),
('98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, '8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, 1),
('98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, 'ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, 2),
('98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, '7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, 3),
('98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, '60551769-57f3-4dbd-9314-1044e806aafb'::uuid, 4),
('60551769-57f3-4dbd-9314-1044e806aafb'::uuid, '7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, 1),
('60551769-57f3-4dbd-9314-1044e806aafb'::uuid, '8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, 2),
('60551769-57f3-4dbd-9314-1044e806aafb'::uuid, '98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, 3),
('60551769-57f3-4dbd-9314-1044e806aafb'::uuid, 'ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, 4),
('ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, '98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, 1),
('ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, '8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, 2),
('ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, '7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, 3),
('ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, '60551769-57f3-4dbd-9314-1044e806aafb'::uuid, 4),
('7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, '98a4b61b-ad44-4a5b-986f-4c34918f86d2'::uuid, 1),
('7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, 'ddebd823-f64e-4225-8170-b95de2503ad4'::uuid, 2),
('7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, '60551769-57f3-4dbd-9314-1044e806aafb'::uuid, 3),
('7ebf692c-9046-48df-a2ec-cfdd143af07d'::uuid, '8c992431-5d80-455f-bd8a-fb482fb13eb0'::uuid, 4);
COMMIT;
