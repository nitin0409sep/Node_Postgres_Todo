/* Replace with your SQL commands */
CREATE SEQUENCE todo_id_seq;

ALTER TABLE todo ALTER COLUMN id SET DEFAULT nextval('todo_id_seq');

SELECT setval('todo_id_seq', COALESCE((SELECT MAX(id) FROM todo), 1));

