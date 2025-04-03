import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUIContext } from '../contexts/UIContext';

const Header = () => {
  const { isMenuOpen, toggleMenu } = useUIContext();
  
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={toggleMenu}
      >
        <Ionicons name={isMenuOpen ? "close" : "menu"} size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 3,
  },
  menuButton: {
    padding: 10,
    borderRadius: 20,
  },
});

export default Header; 