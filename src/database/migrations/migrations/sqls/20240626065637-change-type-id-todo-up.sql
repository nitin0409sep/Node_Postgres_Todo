/* Replace with your SQL commands */

-- ALTER TABLE todo ALTER COLUMN id DROP DEFAULT;
-- DROP SEQUENCE IF EXISTS todo_id_seq;

-- ALTER TABLE todo
-- ALTER COLUMN id TYPE SERIAL

DROP SEQUENCE IF EXISTS todo_id_seq;

-- Alter column type to INTEGER
ALTER TABLE todo
ALTER COLUMN id TYPE INTEGER;

-- Create a new sequence
CREATE SEQUENCE todo_id_seq
START WITH 1
INCREMENT BY 1;

-- Set the default value of the column to use the new sequence
ALTER TABLE todo
ALTER COLUMN id SET DEFAULT nextval('todo_id_seq');
