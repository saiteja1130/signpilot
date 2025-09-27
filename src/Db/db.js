import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {
    name: 'mydb.db',
    location: 'default',
  },
  () => {
    console.log('Database opened');
  },
  error => {
    console.log('Error opening DB: ', error);
  },
);

export const createUsersTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tokenNumber TEXT,
        adminId TEXT,
        userId TEXT,
        role TEXT,
        status TEXT
      );`,
      [],
      () => {
        console.log('Users table created successfully');
      },
      error => {
        console.log('Error creating users table:', error);
      },
    );
  });
};

export const insertUser = data => {
  const {token, adminId, userId, role, status} = data;
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO users (tokenNumber, adminId, userId, role, status) VALUES (?, ?, ?, ?, ?)`,
      [token, adminId, userId, role, status],
      () => {
        console.log('User inserted successfully');
      },
      error => {
        console.log('Error inserting user:', error);
      },
    );
  });
};

export const getUsers = callback => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM users', [], (tx, results) => {
      let users = [];
      for (let i = 0; i < results.rows.length; i++) {
        users.push(results.rows.item(i));
      }
      callback(users);
    });
  });
};

export const dropUsersTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DROP TABLE IF EXISTS users;',
      [],
      () => {
        console.log('Users table dropped successfully');
      },
      error => {
        console.log('Error dropping users table:', error);
      },
    );
  });
};
