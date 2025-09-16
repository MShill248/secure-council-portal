DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    username TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL VARCHAR(50),
    last_name TEXT NOT NULL VARCHAR(50),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    postcode TEXT NOT NULL VARCHAR(8),
    borough TEXT NOT NULL VARCHAR(20),
    phone_number TEXT NOT NULL VARCHAR(15),
    user_role TEXT NOT NULL VARCHAR(20),
    PRIMARY KEY (user_id)
);

DROP TABLE IF EXISTS requests;

CREATE TABLE requests (
    request_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL ,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    PRIMARY KEY (request_id)
);

DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    message_id INT GENERATED ALWAYS AS IDENTITY,
    request_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    PRIMARY KEY (message_id)
);