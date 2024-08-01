import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { openDatabase } from 'expo-sqlite';
import { insertProduct, getProducts, deleteProduct, changeActive } from './database';

const db = openDatabase('products.db');

export default function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [active, setActive] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    createTable();
    fetchProducts();
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, active INTEGER);'
      );
    });
  };


  const fetchProducts = () => {
    getProducts((products) => {
      setProducts(products);
    });
  };

  const handleCreate = () => {
    insertProduct(name, description, price, active);
    setName('');
    setDescription('');
    setPrice('');
    setActive(true);
    fetchProducts();
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    fetchProducts();
  };

  const toggleActivate = (id, currentActive) => {
    let newActive = !currentActive;
    changeActive(id, newActive);
    fetchProducts();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create" onPress={handleCreate} />
      </View>
      <View style={styles.productList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productItem}>
            {product.active && <>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </>}
            <Text style={styles.productPrice}>{product.active ? 'Active' : 'Inactive'}</Text>
            <View style={styles.buttonContainer}>
              <Button
                title={product.active ? 'Deactivate' : 'Activate'}
                onPress={() => toggleActivate(product.id, product.active)}
                color="orange"
              />
              {product.active &&
                <Button
                  title="Delete"
                  onPress={() => handleDelete(product.id)}
                  color="red"
                />
              }
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  productList: {
    marginTop: 20,
  },
  productItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 13,
  },
  productPrice: {
    fontSize: 14,
    color: 'grey',
  },
});
