-- MySQL 8+ demo seed for LibraryMS.  It uses natural keys only; no IDs are hardcoded.
-- Password for every seeded account: password
SET NAMES utf8mb4;
SET @demo_password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

-- 1. Categories
INSERT INTO categories (category_name) VALUES
('Computer Science'),('Programming'),('Java'),('Python'),('Web Development'),
('Database Systems'),('Artificial Intelligence'),('Machine Learning'),('Data Science'),('Cyber Security'),
('Networking'),('Operating Systems'),('Software Engineering'),('Cloud Computing'),('DevOps'),
('Mathematics'),('Physics'),('Electronics'),('History'),('Management'),('Business'),('Fiction'),
('Self Help'),('Biography'),('Competitive Programming')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

-- 2. Users: one administrator, five librarians, and twenty-five students.
INSERT INTO users (name,email,password,phone_number,role,enabled) VALUES
('Lalit Gangwar','admin@libraryms.demo',@admin_password,'9876501001','ADMIN',TRUE),

('Ananya Verma','ananya.verma@libraryms.demo',@librarian_password,'9876501101','LIBRARIAN',TRUE),
('Rohit Mehta','rohit.mehta@libraryms.demo',@librarian_password,'9876501102','LIBRARIAN',TRUE),
('Priya Nair','priya.nair@libraryms.demo',@librarian_password,'9876501103','LIBRARIAN',TRUE),
('Karan Shah','karan.shah@libraryms.demo',@librarian_password,'9876501104','LIBRARIAN',TRUE),
('Meera Iyer','meera.iyer@libraryms.demo',@librarian_password,'9876501105','LIBRARIAN',TRUE),

('Aarav Sharma','aarav.sharma@student.demo',@student_password,'9876502001','STUDENT',TRUE),
('Diya Patel','diya.patel@student.demo',@student_password,'9876502002','STUDENT',TRUE),
('Vivaan Gupta','vivaan.gupta@student.demo',@student_password,'9876502003','STUDENT',TRUE),
('Ananya Singh','ananya.singh@student.demo',@student_password,'9876502004','STUDENT',TRUE),
('Aditya Kumar','aditya.kumar@student.demo',@student_password,'9876502005','STUDENT',TRUE),
('Isha Rao','isha.rao@student.demo',@student_password,'9876502006','STUDENT',TRUE),
('Kabir Khan','kabir.khan@student.demo',@student_password,'9876502007','STUDENT',TRUE),
('Sneha Joshi','sneha.joshi@student.demo',@student_password,'9876502008','STUDENT',TRUE),
('Arjun Malhotra','arjun.malhotra@student.demo',@student_password,'9876502009','STUDENT',TRUE),
('Nisha Kapoor','nisha.kapoor@student.demo',@student_password,'9876502010','STUDENT',TRUE),
('Rohan Das','rohan.das@student.demo',@student_password,'9876502011','STUDENT',TRUE),
('Kavya Menon','kavya.menon@student.demo',@student_password,'9876502012','STUDENT',TRUE),
('Yash Jain','yash.jain@student.demo',@student_password,'9876502013','STUDENT',TRUE),
('Tanvi Kulkarni','tanvi.kulkarni@student.demo',@student_password,'9876502014','STUDENT',TRUE),
('Siddharth Roy','siddharth.roy@student.demo',@student_password,'9876502015','STUDENT',TRUE),
('Pooja Bansal','pooja.bansal@student.demo',@student_password,'9876502016','STUDENT',TRUE),
('Harsh Vardhan','harsh.vardhan@student.demo',@student_password,'9876502017','STUDENT',TRUE),
('Riya Chawla','riya.chawla@student.demo',@student_password,'9876502018','STUDENT',FALSE),
('Manav Sethi','manav.sethi@student.demo',@student_password,'9876502019','STUDENT',TRUE),
('Aditi Bose','aditi.bose@student.demo',@student_password,'9876502020','STUDENT',TRUE),
('Neel Agrawal','neel.agrawal@student.demo',@student_password,'9876502021','STUDENT',FALSE),
('Simran Kaur','simran.kaur@student.demo',@student_password,'9876502022','STUDENT',TRUE),
('Dev Arora','dev.arora@student.demo',@student_password,'9876502023','STUDENT',TRUE),
('Maya Thomas','maya.thomas@student.demo',@student_password,'9876502024','STUDENT',TRUE),
('Ibrahim Ali','ibrahim.ali@student.demo',@student_password,'9876502025','STUDENT',TRUE)
ON DUPLICATE KEY UPDATE
name=VALUES(name),
password=VALUES(password),
phone_number=VALUES(phone_number),
role=VALUES(role),
enabled=VALUES(enabled);

-- 3. One hundred real college-library titles. Category IDs are resolved by category name.
DROP TEMPORARY TABLE IF EXISTS demo_books;
CREATE TEMPORARY TABLE demo_books (title VARCHAR(200),author VARCHAR(100),category_name VARCHAR(100),shelf_no VARCHAR(20),quantity INT);
INSERT INTO demo_books VALUES
('Introduction to Algorithms','Thomas H. Cormen','Competitive Programming','CS-A01',8),('Clean Code','Robert C. Martin','Software Engineering','CS-A02',6),('The Pragmatic Programmer','Andrew Hunt','Programming','CS-A03',7),('Effective Java','Joshua Bloch','Java','CS-A04',5),('Java Concurrency in Practice','Brian Goetz','Java','CS-A05',4),('Spring in Action','Craig Walls','Java','CS-A06',6),('Spring Boot in Action','Craig Walls','Java','CS-A07',5),('Head First Java','Kathy Sierra','Java','CS-A08',9),('Core Java Volume I','Cay S. Horstmann','Java','CS-A09',6),('Java: The Complete Reference','Herbert Schildt','Java','CS-A10',7),
('Python Crash Course','Eric Matthes','Python','CS-B01',8),('Fluent Python','Luciano Ramalho','Python','CS-B02',5),('Automate the Boring Stuff with Python','Al Sweigart','Python','CS-B03',10),('Learning Python','Mark Lutz','Python','CS-B04',6),('Python for Data Analysis','Wes McKinney','Data Science','CS-B05',7),('Eloquent JavaScript','Marijn Haverbeke','Web Development','CS-B06',6),('You Don''t Know JS Yet','Kyle Simpson','Web Development','CS-B07',5),('Learning React','Alex Banks','Web Development','CS-B08',7),('React Up and Running','Stoyan Stefanov','Web Development','CS-B09',4),('CSS: The Definitive Guide','Eric A. Meyer','Web Development','CS-B10',6),
('Designing Data-Intensive Applications','Martin Kleppmann','Database Systems','DB-A01',8),('Database System Concepts','Abraham Silberschatz','Database Systems','DB-A02',7),('Fundamentals of Database Systems','Ramez Elmasri','Database Systems','DB-A03',6),('SQL Antipatterns','Bill Karwin','Database Systems','DB-A04',4),('High Performance MySQL','Baron Schwartz','Database Systems','DB-A05',5),('Artificial Intelligence: A Modern Approach','Stuart Russell','Artificial Intelligence','AI-A01',8),('Hands-On Machine Learning','Aurélien Géron','Machine Learning','AI-A02',7),('Pattern Recognition and Machine Learning','Christopher Bishop','Machine Learning','AI-A03',4),('Deep Learning','Ian Goodfellow','Machine Learning','AI-A04',6),('The Hundred-Page Machine Learning Book','Andriy Burkov','Machine Learning','AI-A05',5),
('Grokking Algorithms','Aditya Bhargava','Competitive Programming','CS-C01',9),('Competitive Programming 4','Steven Halim','Competitive Programming','CS-C02',5),('The Algorithm Design Manual','Steven S. Skiena','Competitive Programming','CS-C03',6),('Cracking the Coding Interview','Gayle Laakmann McDowell','Competitive Programming','CS-C04',8),('Elements of Programming Interviews','Adnan Aziz','Competitive Programming','CS-C05',5),('Computer Networks','Andrew S. Tanenbaum','Networking','NW-A01',7),('Computer Networking: A Top-Down Approach','James Kurose','Networking','NW-A02',6),('TCP/IP Illustrated','W. Richard Stevens','Networking','NW-A03',4),('Network Security Essentials','William Stallings','Cyber Security','NW-A04',5),('The Web Application Hacker''s Handbook','Dafydd Stuttard','Cyber Security','NW-A05',3),
('Operating System Concepts','Abraham Silberschatz','Operating Systems','OS-A01',8),('Modern Operating Systems','Andrew S. Tanenbaum','Operating Systems','OS-A02',6),('Linux Kernel Development','Robert Love','Operating Systems','OS-A03',4),('How Linux Works','Brian Ward','Operating Systems','OS-A04',7),('UNIX and Linux System Administration Handbook','Evi Nemeth','Operating Systems','OS-A05',3),('Designing Distributed Systems','Brendan Burns','Cloud Computing','CL-A01',5),('Cloud Native Patterns','Cornelia Davis','Cloud Computing','CL-A02',4),('Kubernetes Up and Running','Kelsey Hightower','Cloud Computing','CL-A03',6),('The DevOps Handbook','Gene Kim','DevOps','CL-A04',7),('Accelerate','Nicole Forsgren','DevOps','CL-A05',5),
('Site Reliability Engineering','Betsy Beyer','DevOps','CL-B01',6),('Infrastructure as Code','Kief Morris','DevOps','CL-B02',4),('Domain-Driven Design','Eric Evans','Software Engineering','SE-A01',5),('Refactoring','Martin Fowler','Software Engineering','SE-A02',7),('Design Patterns','Erich Gamma','Software Engineering','SE-A03',8),('Code Complete','Steve McConnell','Software Engineering','SE-A04',6),('The Mythical Man-Month','Frederick P. Brooks','Software Engineering','SE-A05',4),('Discrete Mathematics and Its Applications','Kenneth Rosen','Mathematics','MA-A01',9),('Linear Algebra Done Right','Sheldon Axler','Mathematics','MA-A02',5),('Calculus','James Stewart','Mathematics','MA-A03',10),
('Introduction to Probability','Dimitri Bertsekas','Mathematics','MA-A04',5),('A Brief History of Time','Stephen Hawking','Physics','PH-A01',8),('Fundamentals of Physics','David Halliday','Physics','PH-A02',7),('The Feynman Lectures on Physics','Richard Feynman','Physics','PH-A03',6),('Six Easy Pieces','Richard Feynman','Physics','PH-A04',4),('The Art of Electronics','Paul Horowitz','Electronics','EL-A01',5),('Microelectronic Circuits','Adel S. Sedra','Electronics','EL-A02',6),('The Innovators','Walter Isaacson','History','HI-A01',5),('Sapiens','Yuval Noah Harari','History','HI-A02',9),('Guns, Germs, and Steel','Jared Diamond','History','HI-A03',5),
('The Lean Startup','Eric Ries','Management','MG-A01',7),('Good to Great','Jim Collins','Management','MG-A02',6),('The Hard Thing About Hard Things','Ben Horowitz','Management','MG-A03',4),('Zero to One','Peter Thiel','Business','BU-A01',6),('The Personal MBA','Josh Kaufman','Business','BU-A02',5),('Thinking, Fast and Slow','Daniel Kahneman','Self Help','SH-A01',7),('Atomic Habits','James Clear','Self Help','SH-A02',10),('Deep Work','Cal Newport','Self Help','SH-A03',6),('Steve Jobs','Walter Isaacson','Biography','BI-A01',6),('The Diary of a Young Girl','Anne Frank','Biography','BI-A02',5),
('To Kill a Mockingbird','Harper Lee','Fiction','FI-A01',9),('1984','George Orwell','Fiction','FI-A02',8),('The Great Gatsby','F. Scott Fitzgerald','Fiction','FI-A03',6),('The Alchemist','Paulo Coelho','Fiction','FI-A04',10),('Pride and Prejudice','Jane Austen','Fiction','FI-A05',7),('The Hobbit','J. R. R. Tolkien','Fiction','FI-A06',6),('Dune','Frank Herbert','Fiction','FI-A07',5),('The Catcher in the Rye','J. D. Salinger','Fiction','FI-A08',4),('The Da Vinci Code','Dan Brown','Fiction','FI-A09',7),('Harry Potter and the Philosopher''s Stone','J. K. Rowling','Fiction','FI-A10',10),
('Introduction to Computer Science','Robert Sedgewick','Computer Science','CS-D01',8),('Computer Organization and Design','David Patterson','Computer Science','CS-D02',6),('Structure and Interpretation of Computer Programs','Harold Abelson','Computer Science','CS-D03',5),('Computer Science: An Overview','J. Glenn Brookshear','Computer Science','CS-D04',7),('Data Science for Business','Foster Provost','Data Science','DS-A01',6),('Practical Statistics for Data Scientists','Peter Bruce','Data Science','DS-A02',4),('Cybersecurity and Cyberwar','P. W. Singer','Cyber Security','CY-A01',5),('The Tangled Web','Michal Zalewski','Cyber Security','CY-A02',3),('Clean Architecture','Robert C. Martin','Software Engineering','SE-A06',6),('Building Microservices','Sam Newman','Software Engineering','SE-A07',5);

INSERT INTO books (title,author,isbn,category_id,quantity,available_quantity,shelf_no,created_at,lock_version)
SELECT d.title,d.author,CONCAT('978900',LPAD(ROW_NUMBER() OVER (ORDER BY d.title),7,'0')),c.category_id,d.quantity,d.quantity,d.shelf_no,NOW(),0
FROM demo_books d JOIN categories c ON c.category_name=d.category_name
ON DUPLICATE KEY UPDATE title=VALUES(title),author=VALUES(author),category_id=VALUES(category_id),quantity=VALUES(quantity),shelf_no=VALUES(shelf_no);

-- Complete the catalogue to one hundred distinct records.
INSERT INTO books (title,author,isbn,category_id,quantity,available_quantity,shelf_no,created_at,lock_version)
SELECT x.title,x.author,CONCAT('978901',LPAD(ROW_NUMBER() OVER (ORDER BY x.title),7,'0')),c.category_id,x.quantity,x.quantity,x.shelf_no,NOW(),0
FROM (
SELECT 'Pro Git' title,'Scott Chacon' author,'DevOps' category_name,'CL-B03' shelf_no,5 quantity UNION ALL SELECT 'Learning SQL','Alan Beaulieu','Database Systems','DB-A06',6 UNION ALL SELECT 'Head First Design Patterns','Eric Freeman','Software Engineering','SE-A08',7 UNION ALL SELECT 'The C Programming Language','Brian Kernighan','Programming','CS-D05',6 UNION ALL SELECT 'Introduction to the Theory of Computation','Michael Sipser','Computer Science','CS-D06',4 UNION ALL SELECT 'Modern C++ Design','Andrei Alexandrescu','Programming','CS-D07',3 UNION ALL SELECT 'The Phoenix Project','Gene Kim','DevOps','CL-B04',6 UNION ALL SELECT 'Algorithms','Robert Sedgewick','Competitive Programming','CS-C06',7 UNION ALL SELECT 'Neural Networks and Deep Learning','Michael Nielsen','Machine Learning','AI-A06',5
) x JOIN categories c ON c.category_name=x.category_name
ON DUPLICATE KEY UPDATE title=VALUES(title),author=VALUES(author),category_id=VALUES(category_id),quantity=VALUES(quantity),shelf_no=VALUES(shelf_no);

-- 4. Sixty issues: 24 active (including overdue) and 36 returned across recent months.
DROP TEMPORARY TABLE IF EXISTS demo_issue_rows;
CREATE TEMPORARY TABLE demo_issue_rows AS
WITH RECURSIVE n AS (SELECT 1 n UNION ALL SELECT n+1 FROM n WHERE n<60),
students AS (SELECT user_id,ROW_NUMBER() OVER (ORDER BY email) rn FROM users WHERE role='STUDENT' AND enabled=TRUE),
catalogue AS (SELECT book_id,ROW_NUMBER() OVER (ORDER BY isbn) rn FROM books WHERE isbn LIKE '978900%')
SELECT n.n,s.user_id,b.book_id,DATE_SUB(CURDATE(),INTERVAL n.n*3 DAY) issue_date,DATE_ADD(DATE_SUB(CURDATE(),INTERVAL n.n*3 DAY),INTERVAL 14 DAY) due_date,
CASE WHEN n.n<=24 THEN NULL ELSE DATE_ADD(DATE_SUB(CURDATE(),INTERVAL n.n*3 DAY),INTERVAL 12+MOD(n.n,6) DAY) END return_date,
CASE WHEN n.n<=24 THEN 'ISSUED' ELSE 'RETURNED' END status
FROM n JOIN students s ON s.rn=MOD(n.n-1,23)+1 JOIN catalogue b ON b.rn=n.n;
INSERT INTO book_issue (user_id,book_id,issue_date,due_date,return_date,status)
SELECT d.user_id,d.book_id,d.issue_date,d.due_date,d.return_date,d.status FROM demo_issue_rows d
WHERE NOT EXISTS (SELECT 1 FROM book_issue i WHERE i.user_id=d.user_id AND i.book_id=d.book_id AND i.issue_date=d.issue_date);
UPDATE books b SET available_quantity=GREATEST(0,b.quantity-(SELECT COUNT(*) FROM book_issue i WHERE i.book_id=b.book_id AND i.status='ISSUED')) WHERE b.isbn LIKE '978900%';

-- 5. News; authors are resolved by email.
INSERT INTO news (title, description, posted_by, created_at, published)
SELECT
    news_data.title,
    news_data.description,
    author.user_id,
    news_data.created_at,
    TRUE
FROM (
    SELECT
        'Extended library hours' AS title,
        'The library remains open until 9 PM during examination week.' AS description,
        'admin@libraryms.demo' AS author_email,
        DATE_SUB(NOW(), INTERVAL 2 DAY) AS created_at
    UNION ALL SELECT 'New Spring Boot titles added', 'New backend development books are now available in the Java section.', 'ananya.verma@libraryms.demo', DATE_SUB(NOW(), INTERVAL 5 DAY)
    UNION ALL SELECT 'Reading Week 2026', 'Join author talks, a book swap, and daily reading challenges.', 'priya.nair@libraryms.demo', DATE_SUB(NOW(), INTERVAL 9 DAY)
    UNION ALL SELECT 'Database maintenance notice', 'The digital catalogue will be unavailable for one hour on Sunday.', 'rohit.mehta@libraryms.demo', DATE_SUB(NOW(), INTERVAL 13 DAY)
    UNION ALL SELECT 'Coding competition registrations open', 'Register at the circulation desk before Friday.', 'karan.shah@libraryms.demo', DATE_SUB(NOW(), INTERVAL 18 DAY)
    UNION ALL SELECT 'Book donation drive', 'Donate gently used academic and fiction books this month.', 'meera.iyer@libraryms.demo', DATE_SUB(NOW(), INTERVAL 25 DAY)
    UNION ALL SELECT 'Holiday closure notice', 'The library will be closed for the national holiday.', 'admin@libraryms.demo', DATE_SUB(NOW(), INTERVAL 32 DAY)
    UNION ALL SELECT 'Digital library launch', 'Remote access to selected journals is now available.', 'ananya.verma@libraryms.demo', DATE_SUB(NOW(), INTERVAL 40 DAY)
    UNION ALL SELECT 'Hackathon resource corner', 'Curated cloud and DevOps resources are available near the help desk.', 'rohit.mehta@libraryms.demo', DATE_SUB(NOW(), INTERVAL 48 DAY)
    UNION ALL SELECT 'Semester return reminder', 'Please return books before the semester break.', 'priya.nair@libraryms.demo', DATE_SUB(NOW(), INTERVAL 57 DAY)
    UNION ALL SELECT 'New arrivals: data science', 'Fresh data science titles have been added to shelf DS-A.', 'meera.iyer@libraryms.demo', DATE_SUB(NOW(), INTERVAL 64 DAY)
    UNION ALL SELECT 'Research skills workshop', 'Learn effective literature search techniques this Wednesday.', 'ananya.verma@libraryms.demo', DATE_SUB(NOW(), INTERVAL 72 DAY)
    UNION ALL SELECT 'Reading room etiquette', 'Please keep phone calls outside the reading room.', 'rohit.mehta@libraryms.demo', DATE_SUB(NOW(), INTERVAL 80 DAY)
    UNION ALL SELECT 'Exam preparation resources', 'Past papers and study guides are available at the reference desk.', 'priya.nair@libraryms.demo', DATE_SUB(NOW(), INTERVAL 88 DAY)
    UNION ALL SELECT 'Library orientation', 'New students can attend the weekly library orientation tour.', 'karan.shah@libraryms.demo', DATE_SUB(NOW(), INTERVAL 96 DAY)

    UNION ALL SELECT 'E-book access update', 'Several new publishers are now available through the digital library.', 'meera.iyer@libraryms.demo', DATE_SUB(NOW(), INTERVAL 104 DAY)
    UNION ALL SELECT 'Open source workshop', 'A practical Git and GitHub workshop will be held next week.', 'admin@libraryms.demo', DATE_SUB(NOW(), INTERVAL 112 DAY)
    UNION ALL SELECT 'Journal subscriptions renewed', 'Current engineering and science journals are available online.', 'ananya.verma@libraryms.demo', DATE_SUB(NOW(), INTERVAL 120 DAY)
    UNION ALL SELECT 'Summer book club', 'Vote for this month''s fiction book club selection at the desk.', 'rohit.mehta@libraryms.demo', DATE_SUB(NOW(), INTERVAL 128 DAY)
    UNION ALL SELECT 'Catalogue search tips', 'Try title, author, and ISBN searches to find resources faster.', 'priya.nair@libraryms.demo', DATE_SUB(NOW(), INTERVAL 136 DAY)
) AS news_data
JOIN users AS author
    ON author.email = news_data.author_email
WHERE NOT EXISTS (
    SELECT 1
    FROM news AS existing_news
    WHERE existing_news.title = news_data.title
);

-- 6. Feedback and 7. Complaints use generated student references and supported statuses.
INSERT INTO feedback (user_id,message,rating,created_at)
WITH RECURSIVE n AS (SELECT 1 n UNION ALL SELECT n+1 FROM n WHERE n<30), students AS (SELECT user_id,ROW_NUMBER() OVER (ORDER BY email) rn FROM users WHERE role='STUDENT')
SELECT s.user_id,CASE MOD(n.n,5) WHEN 0 THEN 'Excellent catalogue search and helpful staff.' WHEN 1 THEN 'The issue and return process was quick and clear.' WHEN 2 THEN 'Good collection, but more copies of popular books would help.' WHEN 3 THEN 'The reading room was crowded this afternoon.' ELSE 'Please improve WiFi coverage near the journals section.' END,MOD(n.n,5)+1,DATE_SUB(NOW(),INTERVAL n.n*4 DAY)
FROM n JOIN students s ON s.rn=MOD(n.n-1,25)+1 WHERE NOT EXISTS (SELECT 1 FROM feedback f WHERE f.user_id=s.user_id AND DATE(f.created_at)=DATE_SUB(CURDATE(),INTERVAL n.n*4 DAY));
INSERT INTO complaints (user_id,subject,description,status,created_at)
WITH RECURSIVE n AS (SELECT 1 n UNION ALL SELECT n+1 FROM n WHERE n<25), students AS (SELECT user_id,ROW_NUMBER() OVER (ORDER BY email) rn FROM users WHERE role='STUDENT')
SELECT s.user_id,ELT(MOD(n.n-1,8)+1,'Book unavailable','Late fine clarification','Damaged book copy','Lost ID card','Reading room issue','WiFi issue','Seat availability','Computer not working'),CONCAT('Demo complaint #',n.n,' recorded for realistic support history.'),ELT(MOD(n.n-1,3)+1,'PENDING','IN_PROGRESS','RESOLVED'),DATE_SUB(NOW(),INTERVAL n.n*5 DAY)
FROM n JOIN students s ON s.rn=MOD(n.n-1,25)+1 WHERE NOT EXISTS (SELECT 1 FROM complaints c WHERE c.user_id=s.user_id AND c.subject=ELT(MOD(n.n-1,8)+1,'Book unavailable','Late fine clarification','Damaged book copy','Lost ID card','Reading room issue','WiFi issue','Seat availability','Computer not working') AND DATE(c.created_at)=DATE_SUB(CURDATE(),INTERVAL n.n*5 DAY));
