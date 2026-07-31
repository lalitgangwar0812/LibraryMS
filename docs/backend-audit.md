# Backend stabilization audit

## Scope reviewed

All JPA entities, DTOs, repositories, services, controllers, security configuration, exception handling, and application configuration were reviewed.

## Corrections applied

- The duplicate, empty `security/SecurityConfig.java` class was removed. The configured security chain remains `config/SecurityConfig.java`.
- User email remains database-unique and is now consistently looked up case-insensitively. Registration stores a trimmed, lowercase email so `User@Example.com` cannot become a second account where the database collation allows it.
- User column lengths now match the public input boundary and bcrypt output size.
- Book creation timestamps are application-managed, rather than relying on an undocumented database default.
- `books.lock_version` provides optimistic locking for concurrent issue and return operations. Book issue/return paths are transactional.
- Book quantity cannot be reduced below the number already issued. Books with issue history cannot be deleted, preserving the book-issue foreign key and audit history.
- JWT and book-issue request logging, including raw bearer tokens, was removed. Invalid JWTs no longer turn into server errors in the filter.
- Authentication now reuses `CustomUserDetailsService` rather than constructing a second, divergent `UserDetails` representation.

## Schema and relationships

The migration at `src/main/resources/db/migration/V2__stabilize_user_and_inventory_schema.sql` records the required database changes and every JPA foreign key:

- `books.category_id -> categories.category_id`
- `book_issue.user_id -> users.user_id`
- `book_issue.book_id -> books.book_id`
- `complaints`, `enquiries`, and `feedback`.user_id -> users.user_id
- `news.posted_by -> users.user_id`

Run its duplicate-email preflight query and skip any foreign-key addition that already exists. It is intentionally not auto-executed because this project does not yet use a migration runner and deployed databases may already have Hibernate-created constraints.

## Remaining design risks to address before production modules expand

- Current controller authorization is mostly authentication-only. Several endpoints accept a `userId` or `postedBy` supplied by the client, so ownership/role checks should be added when those modules are completed.
- List endpoints are unpaged and DTO mapping can cause N+1 relationship queries. Add pagination and fetch projections before data volume grows.
- `ddl-auto=update` is useful during development but should become `validate` once the migration history is managed by Flyway or Liquibase.
- The JWT secret and database password are committed in `application.properties`; supply them through environment variables or a secret manager in deployed environments.
- `AdminStudentService` exposes `joinedAt` as the current date because `User` has no persisted creation timestamp. Add an immutable user creation timestamp in a dedicated future migration before relying on that value.
