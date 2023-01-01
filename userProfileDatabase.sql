CREATE DATABASE user_profile;

--\c into balance_app_database

CREATE TABLE userProfile(
	todo_id SERIAL PRIMARY KEY,
	description VARCHAR(255)
);
