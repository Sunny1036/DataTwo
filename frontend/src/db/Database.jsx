// Database.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import ApiFactory from '../../ApiFactory/ApiFactory';

const db = SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });

const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, tokenName TEXT, token TEXT)',
      [],
      (tx, results) => {
        console.log('Tokens table created successfully');
      },
      error => {
        console.error('Error creating tokens table: ', error);
      }
    );
  });
};

const addToken = (tokenName, token) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO tokens (tokenName, token) VALUES (?, ?)',
      [tokenName, token],
      (tx, results) => {
        console.log('Token added successfully');
      },
      error => {
        console.error('Error adding token: ', error);
      }
    );
  });
};

const getTokens = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tokens',
      [],
      (tx, results) => {
        const len = results.rows.length;
        for (let i = 0; i < len; i++) {
          const token = results.rows.item(i);
          console.log(`Token ID: ${token.id}, Name: ${token.tokenName}, Token: ${token.token}`);
        }
      },
      error => {
        console.error('Error fetching tokens: ', error);
      }
    );
  });
};

const clearTokens = () => {
  Alert.alert(
    'Clear Tokens',
    'Are you sure you want to clear all tokens?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          db.transaction(tx => {
            tx.executeSql('DELETE FROM tokens', [], (tx, results) => {
              console.log('Tokens cleared successfully');

              // After clearing tokens, reset the primary key sequence
              tx.executeSql('DELETE FROM sqlite_sequence WHERE name="tokens"');
            });
          });
        },
      },
    ]
  );
};

const getLastToken = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM tokens ORDER BY id DESC LIMIT 1',
      [],
      (tx, results) => {
        if (results.rows.length > 0) {
          const lastToken = results.rows.item(0);
          callback(lastToken);
        } else {
          callback(null); // No tokens found
        }
      },
      error => {
        console.error('Error fetching last token: ', error);
      }
    );
  });
};

const Database = ({ storeDataFromOtherComponent }) => {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <View>
      <Text>SQLite Database</Text>
      <Button title="Add Token" onPress={() => addToken('SampleToken', 'abc123')} />
      <Button title="Get Tokens" onPress={getTokens} />
      <Button title="Clear Tokens" onPress={clearTokens} />
     
      <Button title="Get Last Token" onPress={() => {getLastToken(lastToken => {
            if (lastToken) {
              console.log('Last Token:', lastToken);
            } else {
              console.log('No tokens found');
            }
          });
        }}
      />
      
    </View>
  );
};

export default Database;
