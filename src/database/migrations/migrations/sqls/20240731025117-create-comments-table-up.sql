/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS Comments (
    comment_id UUID DEFAULT gen_random_uuid(),
    user_id UUID,
    id INT,
    comment VARCHAR(5000),
    FOREIGN KEY (user_id) REFERENCES users(unique_id),
    FOREIGN KEY (id) REFERENCES todo(id)
);
