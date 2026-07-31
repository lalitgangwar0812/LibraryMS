-- Apply this migration once to an existing BookNest/LMS database before using
-- Hibernate schema validation in production. Run the preflight query first;
-- duplicate email values must be resolved before adding the unique key.

-- SELECT email, COUNT(*) AS occurrences
-- FROM users
-- GROUP BY email
-- HAVING COUNT(*) > 1;

ALTER TABLE users
    MODIFY COLUMN name VARCHAR(150) NOT NULL,
    MODIFY COLUMN email VARCHAR(254) NOT NULL,
    MODIFY COLUMN password VARCHAR(100) NOT NULL,
    MODIFY COLUMN phone_number VARCHAR(15) NOT NULL;

ALTER TABLE users
    ADD CONSTRAINT uk_users_email UNIQUE (email);

ALTER TABLE books
    ADD COLUMN lock_version BIGINT NOT NULL DEFAULT 0;

-- These foreign keys preserve the relationships represented by the JPA model.
-- Omit an ADD CONSTRAINT statement only when an equivalent key already exists.
ALTER TABLE books
    ADD CONSTRAINT fk_books_category
        FOREIGN KEY (category_id) REFERENCES categories (category_id);

ALTER TABLE book_issue
    ADD CONSTRAINT fk_book_issue_user
        FOREIGN KEY (user_id) REFERENCES users (user_id),
    ADD CONSTRAINT fk_book_issue_book
        FOREIGN KEY (book_id) REFERENCES books (book_id);

ALTER TABLE complaints
    ADD CONSTRAINT fk_complaints_user
        FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE enquiries
    ADD CONSTRAINT fk_enquiries_user
        FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE feedback
    ADD CONSTRAINT fk_feedback_user
        FOREIGN KEY (user_id) REFERENCES users (user_id);

ALTER TABLE news
    ADD CONSTRAINT fk_news_posted_by
        FOREIGN KEY (posted_by) REFERENCES users (user_id);
