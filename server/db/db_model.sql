CREATE DATABASE jwtauth;

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

INSERT INTO users (user_name, user_email, user_password) VALUES ('burhan batawala','burhan.batawala786@gmail.com','passw@rd989');
INSERT INTO users (user_name, user_email, user_password) VALUES ('kishore mangal','kishore.mangal@gmail.com','passw@rd989');
INSERT INTO users (user_name, user_email, user_password) VALUES ('alok nath','alok.kumar@gmail.com','aloknath');
INSERT INTO users (user_name, user_email, user_password) VALUES ('surendra dhakad','surendra.dhakad@avanthapower.com','dhakad123');
INSERT INTO users (user_name, user_email, user_password) VALUES ('rahul roy','rahul.roy@gmail.com','rahulRoy');