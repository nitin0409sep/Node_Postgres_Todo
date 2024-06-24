/* Replace with your SQL commands */

ALTER TABLE users
ADD PRIMARY KEY (unique_id); -- PK Name - users_pkey

ALTER TABLE todo
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN user_id TYPE UUID
USING user_id::UUID;

ALTER TABLE todo
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(unique_id);

