-- ============================================================================
-- Library Stock Seed Data — 50 Products with varying stock quantities
-- Database: aletheia_library (MySQL)
-- Run: mysql -u root aletheia_library < data-seed.sql
-- ============================================================================

-- Clear existing data (optional — comment out if you want to keep current rows)
DELETE FROM stock_movements;
DELETE FROM products;

INSERT INTO products (title, description, author, type, price, file_url, cover_image_url, available, stock_quantity, stock_threshold, created_at, updated_at) VALUES
-- ─── BOOKS (15) ─────────────────────────────────────────────────────────────
('Introduction to Algorithms', 'Comprehensive textbook covering a broad range of algorithms in depth, used in universities worldwide.', 'Thomas H. Cormen', 'BOOK', 59.99, NULL, 'https://covers.openlibrary.org/b/id/8489096-L.jpg', true, 35, 5, NOW(), NOW()),
('Clean Code', 'A handbook of agile software craftsmanship for writing readable and maintainable code.', 'Robert C. Martin', 'BOOK', 42.50, NULL, 'https://covers.openlibrary.org/b/id/8503238-L.jpg', true, 20, 5, NOW(), NOW()),
('Design Patterns', 'Elements of reusable object-oriented software. The classic Gang of Four reference.', 'Erich Gamma', 'BOOK', 48.00, NULL, 'https://covers.openlibrary.org/b/id/1290385-L.jpg', true, 12, 5, NOW(), NOW()),
('The Pragmatic Programmer', 'Your journey to mastery — timeless advice for modern software developers.', 'David Thomas', 'BOOK', 44.99, NULL, NULL, true, 8, 5, NOW(), NOW()),
('Refactoring', 'Improving the design of existing code. Essential reading for any developer.', 'Martin Fowler', 'BOOK', 47.00, NULL, NULL, true, 3, 5, NOW(), NOW()),
('Head First Java', 'A brain-friendly guide to learning Java programming from scratch.', 'Kathy Sierra', 'BOOK', 38.99, NULL, NULL, true, 45, 10, NOW(), NOW()),
('Effective Java', 'Best practices for the Java platform by one of its key architects.', 'Joshua Bloch', 'BOOK', 41.00, NULL, NULL, true, 18, 5, NOW(), NOW()),
('Structure and Interpretation of Computer Programs', 'Classic MIT textbook on the fundamentals of computer science and programming.', 'Harold Abelson', 'BOOK', 35.00, NULL, NULL, true, 7, 5, NOW(), NOW()),
('You Dont Know JS', 'Deep dive into the mechanics of JavaScript — closures, scopes, and async.', 'Kyle Simpson', 'BOOK', 29.99, NULL, NULL, true, 50, 10, NOW(), NOW()),
('Learning Python', 'Comprehensive introduction to Python programming for beginners and professionals.', 'Mark Lutz', 'BOOK', 55.00, NULL, NULL, true, 25, 5, NOW(), NOW()),
('The Art of Computer Programming', 'Donald Knuths magnum opus — the definitive reference on algorithms.', 'Donald Knuth', 'BOOK', 120.00, NULL, NULL, true, 2, 3, NOW(), NOW()),
('Cracking the Coding Interview', '189 programming questions and solutions for technical interviews.', 'Gayle Laakmann McDowell', 'BOOK', 35.99, NULL, NULL, true, 40, 8, NOW(), NOW()),
('Database System Concepts', 'Fundamental textbook on database design, SQL, and transaction management.', 'Abraham Silberschatz', 'BOOK', 65.00, NULL, NULL, true, 15, 5, NOW(), NOW()),
('Computer Networking: A Top-Down Approach', 'Understand networking from the application layer down to the physical layer.', 'James Kurose', 'BOOK', 70.00, NULL, NULL, true, 10, 5, NOW(), NOW()),
('Operating System Concepts', 'The dinosaur book — essential reading on OS principles and design.', 'Abraham Silberschatz', 'BOOK', 68.00, NULL, NULL, false, 0, 5, NOW(), NOW()),

-- ─── PDFs (15) ───────────────────────────────────────────────────────────────
('Spring Boot Microservices Guide', 'Complete guide to building production-ready microservices with Spring Boot and Spring Cloud.', 'Aletheia Team', 'PDF', 0.00, 'https://example.com/files/spring-boot-guide.pdf', NULL, true, 999, 10, NOW(), NOW()),
('Angular Best Practices 2025', 'Modern Angular patterns: signals, standalone components, and reactive programming.', 'Aletheia Team', 'PDF', 0.00, 'https://example.com/files/angular-best-practices.pdf', NULL, true, 999, 10, NOW(), NOW()),
('Docker & Kubernetes Essentials', 'Hands-on tutorial for containerization, orchestration, and cloud deployment.', 'DevOps Team', 'PDF', 0.00, 'https://example.com/files/docker-k8s.pdf', NULL, true, 500, 10, NOW(), NOW()),
('Python Data Science Handbook', 'Master NumPy, pandas, matplotlib, and scikit-learn for data analysis.', 'Jake VanderPlas', 'PDF', 0.00, 'https://example.com/files/python-ds.pdf', NULL, true, 200, 10, NOW(), NOW()),
('RESTful API Design Guidelines', 'Industry standards and best practices for designing clean RESTful APIs.', 'API Standards Group', 'PDF', 0.00, 'https://example.com/files/rest-api-design.pdf', NULL, true, 150, 5, NOW(), NOW()),
('Machine Learning Algorithms Explained', 'Visual guide to supervised, unsupervised, and reinforcement learning algorithms.', 'ML Research Lab', 'PDF', 12.99, 'https://example.com/files/ml-algorithms.pdf', NULL, true, 75, 10, NOW(), NOW()),
('TypeScript Advanced Patterns', 'Generics, decorators, mapped types, and conditional types deep dive.', 'TS Community', 'PDF', 0.00, 'https://example.com/files/typescript-advanced.pdf', NULL, true, 300, 5, NOW(), NOW()),
('CI/CD Pipeline with Jenkins', 'Step-by-step guide to setting up continuous integration and delivery pipelines.', 'DevOps Team', 'PDF', 0.00, 'https://example.com/files/cicd-jenkins.pdf', NULL, true, 100, 5, NOW(), NOW()),
('Git & GitHub Mastery', 'From beginner to advanced — branching strategies, rebasing, and workflows.', 'Aletheia Team', 'PDF', 0.00, 'https://example.com/files/git-mastery.pdf', NULL, true, 450, 5, NOW(), NOW()),
('SQL Performance Tuning', 'Optimize queries, indexes, and execution plans for MySQL and PostgreSQL.', 'DB Admin Team', 'PDF', 9.99, 'https://example.com/files/sql-tuning.pdf', NULL, true, 60, 10, NOW(), NOW()),
('Cybersecurity Fundamentals', 'Introduction to network security, encryption, and ethical hacking basics.', 'Security Team', 'PDF', 0.00, 'https://example.com/files/cybersecurity-101.pdf', NULL, true, 180, 5, NOW(), NOW()),
('AWS Cloud Practitioner Study Guide', 'Complete preparation material for the AWS Cloud Practitioner certification.', 'Cloud Academy', 'PDF', 14.99, 'https://example.com/files/aws-cp.pdf', NULL, true, 4, 5, NOW(), NOW()),
('Linux Command Line Cheat Sheet', 'Quick reference for essential bash commands, scripting, and system administration.', 'SysAdmin Team', 'PDF', 0.00, 'https://example.com/files/linux-cheatsheet.pdf', NULL, true, 800, 10, NOW(), NOW()),
('React vs Angular Comparison', 'In-depth technical comparison of React and Angular for enterprise applications.', 'Frontend Team', 'PDF', 0.00, 'https://example.com/files/react-vs-angular.pdf', NULL, true, 220, 5, NOW(), NOW()),
('Agile & Scrum Handbook', 'Practical guide to agile methodologies, sprint planning, and retrospectives.', 'PM Team', 'PDF', 0.00, 'https://example.com/files/agile-scrum.pdf', NULL, false, 0, 5, NOW(), NOW()),

-- ─── CHILDREN MATERIAL (10) ─────────────────────────────────────────────────
('Fun with Numbers', 'Colorful workbook teaching basic arithmetic through games and puzzles for ages 5-8.', 'Kids Learning Co.', 'CHILDREN_MATERIAL', 12.99, NULL, NULL, true, 30, 8, NOW(), NOW()),
('My First ABC Book', 'Interactive alphabet learning with illustrations and phonics exercises.', 'Kids Learning Co.', 'CHILDREN_MATERIAL', 9.99, NULL, NULL, true, 55, 10, NOW(), NOW()),
('Science Experiments for Kids', '50 safe and fun experiments that teach basic scientific principles.', 'Young Explorers', 'CHILDREN_MATERIAL', 15.99, NULL, NULL, true, 22, 5, NOW(), NOW()),
('Coding for Kids: Scratch', 'Visual programming with Scratch — build games and animations step by step.', 'Code Kids Academy', 'CHILDREN_MATERIAL', 18.00, NULL, NULL, true, 14, 5, NOW(), NOW()),
('World Geography Coloring Book', 'Learn about countries, capitals, and landmarks while coloring beautiful maps.', 'GeoKids', 'CHILDREN_MATERIAL', 8.50, NULL, NULL, true, 5, 5, NOW(), NOW()),
('Story Time: Classic Tales', 'Collection of 20 classic fairy tales with colorful illustrations.', 'Storyland Press', 'CHILDREN_MATERIAL', 11.99, NULL, NULL, true, 42, 8, NOW(), NOW()),
('Math Puzzles & Brain Teasers', 'Challenging math puzzles for children ages 8-12 to develop problem-solving skills.', 'Brain Builders', 'CHILDREN_MATERIAL', 13.50, NULL, NULL, true, 1, 5, NOW(), NOW()),
('Learn French for Kids', 'Basic French vocabulary and phrases through songs, games, and activities.', 'Language Kids', 'CHILDREN_MATERIAL', 16.00, NULL, NULL, true, 19, 5, NOW(), NOW()),
('Nature Discovery Journal', 'Guided journal for young naturalists to document plants, animals, and weather.', 'Young Explorers', 'CHILDREN_MATERIAL', 10.99, NULL, NULL, true, 33, 5, NOW(), NOW()),
('Robotics for Beginners', 'Introduction to robotics concepts with paper-based building activities.', 'Code Kids Academy', 'CHILDREN_MATERIAL', 20.00, NULL, NULL, false, 0, 5, NOW(), NOW()),

-- ─── EXAMS (10) ──────────────────────────────────────────────────────────────
('Java SE 17 Certification Practice Exam', '300 practice questions covering all objectives of the Oracle Java SE 17 exam.', 'Cert Prep Institute', 'EXAM', 24.99, 'https://example.com/files/java-cert-exam.pdf', NULL, true, 100, 10, NOW(), NOW()),
('AWS Solutions Architect Mock Exam', 'Full-length practice exam simulating the real AWS SA Associate certification.', 'Cloud Academy', 'EXAM', 19.99, 'https://example.com/files/aws-sa-mock.pdf', NULL, true, 80, 10, NOW(), NOW()),
('Spring Professional Certification Exam', 'Practice questions for VMware Spring Professional certification.', 'Cert Prep Institute', 'EXAM', 22.00, 'https://example.com/files/spring-cert.pdf', NULL, true, 45, 5, NOW(), NOW()),
('Python PCAP Practice Test', 'Comprehensive practice test for the PCAP — Certified Associate in Python certification.', 'Python Institute', 'EXAM', 15.00, 'https://example.com/files/pcap-test.pdf', NULL, true, 65, 10, NOW(), NOW()),
('CompTIA Security+ Exam Prep', '500 questions covering network security, compliance, and threat management.', 'Security Cert Co.', 'EXAM', 29.99, 'https://example.com/files/security-plus.pdf', NULL, true, 3, 5, NOW(), NOW()),
('Kubernetes CKAD Mock Exam', 'Hands-on practice exam for the Certified Kubernetes Application Developer test.', 'K8s Academy', 'EXAM', 18.00, 'https://example.com/files/ckad-mock.pdf', NULL, true, 55, 5, NOW(), NOW()),
('Angular Developer Assessment', 'Skill assessment covering Angular fundamentals, RxJS, and NgRx.', 'Aletheia Team', 'EXAM', 0.00, 'https://example.com/files/angular-assessment.pdf', NULL, true, 200, 10, NOW(), NOW()),
('SQL Fundamentals Quiz Bank', '150 SQL questions ranging from basic SELECT to advanced joins and subqueries.', 'DB Admin Team', 'EXAM', 0.00, 'https://example.com/files/sql-quiz.pdf', NULL, true, 350, 10, NOW(), NOW()),
('Linux+ Certification Exam Simulator', 'Practice exam aligned with CompTIA Linux+ objectives.', 'Linux Academy', 'EXAM', 21.00, 'https://example.com/files/linux-plus.pdf', NULL, true, 28, 5, NOW(), NOW()),
('Full Stack Developer Final Exam', 'Comprehensive exam covering frontend, backend, databases, and DevOps topics.', 'Aletheia Team', 'EXAM', 0.00, 'https://example.com/files/fullstack-exam.pdf', NULL, true, 150, 10, NOW(), NOW());

-- ============================================================================
-- Stock Movements — seed some initial history for a few products
-- (references product IDs — will work if IDs start at 1 after the DELETE above)
-- ============================================================================

-- Product insertion order: Books=1-15, PDFs=16-30, Children=31-40, Exams=41-50
INSERT INTO stock_movements (product_id, movement_type, quantity, reason, timestamp) VALUES
-- Clean Code (id=2) — received shipment
((SELECT id FROM products WHERE title='Clean Code'), 'IN', 30, 'Initial shipment from publisher', NOW() - INTERVAL 30 DAY),
((SELECT id FROM products WHERE title='Clean Code'), 'OUT', 10, 'Student purchases', NOW() - INTERVAL 15 DAY),

-- Refactoring (id=5) — low stock scenario
((SELECT id FROM products WHERE title='Refactoring'), 'IN', 15, 'Restock order', NOW() - INTERVAL 45 DAY),
((SELECT id FROM products WHERE title='Refactoring'), 'OUT', 8, 'Semester bulk order', NOW() - INTERVAL 20 DAY),
((SELECT id FROM products WHERE title='Refactoring'), 'OUT', 4, 'Individual sales', NOW() - INTERVAL 5 DAY),

-- The Art of Computer Programming — critically low
((SELECT id FROM products WHERE title='The Art of Computer Programming'), 'IN', 5, 'Special order from publisher', NOW() - INTERVAL 60 DAY),
((SELECT id FROM products WHERE title='The Art of Computer Programming'), 'OUT', 3, 'Faculty purchases', NOW() - INTERVAL 10 DAY),

-- Operating System Concepts — out of stock
((SELECT id FROM products WHERE title='Operating System Concepts'), 'IN', 10, 'Initial stock', NOW() - INTERVAL 90 DAY),
((SELECT id FROM products WHERE title='Operating System Concepts'), 'OUT', 10, 'Sold out during exam period', NOW() - INTERVAL 3 DAY),

-- AWS Cloud Practitioner Study Guide — low stock
((SELECT id FROM products WHERE title='AWS Cloud Practitioner Study Guide'), 'IN', 20, 'Bulk order for certification prep', NOW() - INTERVAL 40 DAY),
((SELECT id FROM products WHERE title='AWS Cloud Practitioner Study Guide'), 'OUT', 16, 'High demand certification season', NOW() - INTERVAL 7 DAY),

-- Math Puzzles & Brain Teasers — critically low
((SELECT id FROM products WHERE title='Math Puzzles & Brain Teasers'), 'IN', 25, 'Back to school restock', NOW() - INTERVAL 50 DAY),
((SELECT id FROM products WHERE title='Math Puzzles & Brain Teasers'), 'OUT', 24, 'School bulk order', NOW() - INTERVAL 2 DAY),

-- CompTIA Security+ Exam Prep — low stock
((SELECT id FROM products WHERE title='CompTIA Security+ Exam Prep'), 'IN', 30, 'New edition received', NOW() - INTERVAL 35 DAY),
((SELECT id FROM products WHERE title='CompTIA Security+ Exam Prep'), 'OUT', 27, 'Cybersecurity bootcamp orders', NOW() - INTERVAL 4 DAY);

-- ============================================================================
-- Summary of stock distribution:
--   • Out of stock (qty=0):  3 products  (IDs 15, 35, 45 — available=false)
--   • Critical (qty 1-3):    4 products  (Refactoring, Art of CS, Math Puzzles, Security+)
--   • Low stock (qty ≤ thr): ~8 products
--   • Normal stock:          ~25 products
--   • High stock (>100):     ~10 products (mostly PDFs/digital)
-- ============================================================================


