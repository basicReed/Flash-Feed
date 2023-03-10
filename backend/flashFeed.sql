
-----------------
-- FLASH FEED DB Creation and Reset (test db included)
-----------------

\echo 'Delete and recreate flashfeed db?'
\prompt 'Return yes or control-C to cancel >'  foo

DROP DATABASE flashfeed;
CREATE DATABASE flashfeed;
\connect flashfeed;

\i flashFeed-schema.sql
\i flashFeed-seed.sql

\echo 'Delete and recreate flashfeed_test db?'
\prompt 'Return yes or control-C to cancel >'  foo

DROP DATABASE flashfeed_test;
CREATE DATABASE flashfeed_test;
\connect flashfeed_test

\i flashFeed-schema.sql