-- Aletheia Platform — MySQL database initialisation
-- This file runs automatically when the MySQL container starts for the first time.

CREATE DATABASE IF NOT EXISTS alethia          CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS library_db       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS event_db         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS resource_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS courses_db       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant full access to root from any host (needed inside Docker network)
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
