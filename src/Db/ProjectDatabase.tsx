import {db} from './db';

export const createImageTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imageID TEXT,
        path TEXT
      );`,
      [],
      (_: any, result: any) => console.log('Table created', result),
      (_: any, error: any) => {
        console.log('Error creating table', error);
        return false;
      },
    );
  });
};

export const dropImageTable = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      'DROP TABLE IF EXISTS Images;',
      [],
      (_: any, result: any) => console.log('Images table dropped', result),
      (_: any, error: any) => console.log('Error dropping Images table', error),
    );
  });
};

export const insertImage = (ImageId: string, path: string) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      'INSERT INTO Images (ImageId, path) VALUES (?, ?)',
      [ImageId, path],
      (_: any, result: any) => console.log('Image inserted', result),
      (_: any, error: any) => console.log('Insert error', error),
    );
  });
};

export const updatePathInsideImageTable = (
  imageID: string,
  newPath: string,
  setImageArr: any,
) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `UPDATE Images SET path = ? WHERE imageID = ?`,
      [newPath, imageID],
      (_: any, result: any) => {
        console.log(`Image ${imageID} path updated to ${newPath}`, result);
        getAllImages(setImageArr);
      },
      (_: any, error: any) => {
        console.log(`Error updating image ${imageID}:`, error);
        return false;
      },
    );
  });
};

export const getAllImages = (setImageArr: any) => {
  db.transaction((tx: any) => {
    tx.executeSql(
      'SELECT * FROM Images',
      [],
      (_: any, results: any) => {
        const rows = [];
        for (let i = 0; i < results.rows.length; i++) {
          rows.push(results.rows.item(i));
        }
        setImageArr(rows);
        console.log('ROWSSSSS:', rows);
      },
      (_: any, error: any) => console.log('Select error', error),
    );
  });
};
