SET @has_reservations := (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = 'reservations'
);

SET @has_teaching_sessions := (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = 'teaching_sessions'
);

SET @cleanup_orphan_reservations_sql := IF(
    @has_reservations > 0 AND @has_teaching_sessions > 0,
    'DELETE r
     FROM reservations r
     LEFT JOIN teaching_sessions ts ON ts.id = r.teaching_session_id
     WHERE r.teaching_session_id IS NOT NULL
       AND ts.id IS NULL',
    'SELECT 1'
);

PREPARE cleanup_stmt FROM @cleanup_orphan_reservations_sql;
EXECUTE cleanup_stmt;
DEALLOCATE PREPARE cleanup_stmt;
