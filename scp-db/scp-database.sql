DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    postcode VARCHAR(8) NOT NULL,
    borough VARCHAR(20) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id)
);

INSERT INTO users (username, first_name, last_name, email, password, dob, address, postcode, borough, phone_number, user_role) VALUES
('alicej', 'Alice', 'Johnson', 'alice.johnson@example.com', 'password123', '1990-05-12', '12 Oak Street', 'E1 4AB', 'Greenwich', '07123456789', 'resident'),
('bobsmith', 'Bob', 'Smith', 'bob.smith@example.com', 'password123', '1985-08-22', '34 Pine Avenue', 'E2 5CD', 'Hackney', '07234567890', 'resident'),
('charlieb', 'Charlie', 'Brown', 'charlie.brown@example.com', 'password123', '1992-11-03', '56 Maple Road', 'E3 6EF', 'Tower Hamlets', '07345678901', 'resident'),
('dianaw', 'Diana', 'Williams', 'diana.williams@example.com', 'password123', '1988-02-17', '78 Birch Lane', 'E4 7GH', 'Lewisham', '07456789012', 'resident'),
('edwardk', 'Edward', 'King', 'edward.king@example.com', 'password123', '1995-09-30', '90 Cedar Street', 'E5 8IJ', 'Southwark', '07567890123', 'resident'),
('council1', 'John', 'Doe', 'john.doe@council.gov', 'password123', '1975-04-10', 'Council House, Main Street', 'E6 9KL', 'Hackney', '07678901234', 'council'),
('council2', 'Jane', 'Smith', 'jane.smith@council.gov', 'password123', '1980-06-15', 'Council House, Main Street', 'E7 1MN', 'Greenwich', '07789012345', 'council');


DROP TABLE IF EXISTS requests;

CREATE TABLE requests (
    request_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL ,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    priority INT NOT NULL CHECK (priority IN (1, 2, 3)),
    type TEXT NOT NULL CHECK (type IN ('incident', 'service')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (request_id)
);

INSERT INTO requests (user_id, title, description, status, category, priority, type, created_at, updated_at)
VALUES
(1, 'Streetlight not working', 'The streetlight outside my house on Elm Street has been out for two weeks.', 'open', 'amenities', 2, 'incident', '2025-09-01 10:15:00', '2025-09-01 10:15:00'),
(2, 'Pothole repair', 'Large pothole on the corner of Maple Avenue and 3rd Street is causing traffic issues.', 'in_progress', 'amenities', 1, 'incident','2025-09-02 14:40:00', '2025-09-05 09:20:00'),
(3, 'Missed waste collection', 'Our recycling bins were not emptied last Friday on Oak Drive.', 'resolved',  'amenities', 3, 'service','2025-09-03 08:05:00', '2025-09-04 16:30:00'),
(4, 'Noise complaint', 'There is excessive noise from construction past 10 PM near Pine Street.', 'open',  'amenities', 2, 'incident','2025-09-04 21:45:00', '2025-09-04 21:45:00'),
(5, 'Graffiti removal', 'Graffiti spotted on the wall of the community center car park.', 'in_progress',  'amenities', 3, 'service','2025-09-05 11:00:00', '2025-09-07 15:10:00'),
(6, 'Damaged playground equipment', 'The swings in Riverside Park are broken and unsafe for children.', 'open', 'amenities',  1, 'incident', '2025-09-06 13:20:00', '2025-09-06 13:20:00'),
(7, 'Illegal dumping', 'Someone has dumped old furniture behind the library.', 'resolved', 'amenities', 2, 'incident', '2025-09-07 17:55:00', '2025-09-08 10:45:00');


DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    message_id INT GENERATED ALWAYS AS IDENTITY,
    request_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (message_id)
);