CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

INSERT INTO role (name) VALUES
    ('admin'),
    ('parent'),
    ('child'),
    ('guest');

CREATE TABLE category(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255)
);

INSERT INTO category (name) VALUES
('Utvikling'),
('Drift'),
('Brukerstøtte'),
('Media'),
('Teknologiforståelse'),
('Yrkesfaglig fordypning'),
('Konseptutvikling og programmering'),
('Matematikk 1P-Y - IM'),
('Engelsk'),
('Naturfag'),
('Kroppsøving'),
('Norsk'),
('Samfunnskunnskap');

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    mobile TEXT,
    age TEXT NOT NULL,
    idRole INTEGER NOT NULL,
    FOREIGN KEY(idRole) REFERENCES role(id)
);

INSERT INTO user (id, username, firstname, lastname, email, password, mobile, age, idRole) VALUES
( '1', 'Hisaks', 'Heine', 'Isaksen', 'heine.isaksen06@gmail.com', '$2b$10$lhpfzhrALVQreswVI9E4ReoLVpcKEeHjaVKEsKgxf8UClr1kZ0Tom', '92166025', 18, 3),
( '2', 'Blixt', 'Odd Erik', 'Blixt Haaskjold', 'moraknuller53@gmail.com', '$2b$10$wRHBFbhgQR5zb.JGTBnxJeWJ4cUddR7LB55WhU/F78syY/pzfMQoS', '47765308', 17, 1);

CREATE TABLE project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category INTEGER NOT NULL,
    status TEXT NOT NULL,
    completedBy INTEGER NOT NULL,
    FOREIGN KEY(category) REFERENCES category(id),
    FOREIGN KEY(completedBy) REFERENCES user(id)
);

INSERT INTO project (name, description, category, status, completedBy) VALUES
('Valgomat', 'Lag en webapp for hvilke parti du er mest enig med', 1, 'fullført', 1),
('PowerToys', 'Lag en brukerveiledning for to funksjoner i powertoys', 3, 'fullført', 1),
('Julefilm', 'Lag en video om julen', 4, 'fullført', 1);