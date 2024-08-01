import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('products.db');

// Create the "Products" table if it doesn't exist
const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, active INTEGER);',
      [],
      null,
      (_, error) => {
        if (error) {
          console.error('Error creating table:', error);
        }
      }
    );
  });
};

// Insert a new product into the "Products" table
const insertProduct = (name, description, price, active) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO Products (name, description, price, active) VALUES (?, ?, ?, ?);',
      [name, description, price, active ? 1 : 0],
      null,
      (_, error) => {
        if (error) {
          console.error('Error inserting product:', error);
        }
      }
    );
  });
};

// Retrieve all products from the "Products" table
const getProducts = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM Products;',
      [],
      (_, { rows }) => {
        const products = rows._array.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          active: product.active === 1,
        }));
        callback(products);
      },
      (_, error) => {
        console.error('Error retrieving products:', error);
      }
    );
  });
};

// Update a product in the "Products" table
const changeActive = (id, newActive) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE Products SET active = ? WHERE id = ?;',
      [newActive ? 1 : 0, id],
      null,
      (_, error) => {
        if (error) {
          console.error('Error updating product:', error);
        }
      }
    );
  });
};

// Delete a product from the "Products" table
const deleteProduct = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM Products WHERE id = ?;',
      [id],
      null,
      (_, error) => {
        if (error) {
          console.error('Error deleting product:', error);
        }
      }
    );
  });
};

export { createTable, insertProduct, getProducts, changeActive, deleteProduct };
