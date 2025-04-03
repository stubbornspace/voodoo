import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUIContext } from '../contexts/UIContext';
import { useDocumentContext } from '../contexts/DocumentContext';

const { width } = Dimensions.get('window');

const Drawer = () => {
  const { slideAnim, toggleMenu } = useUIContext();
  const { createNewDocument, saveDocument, openDocument } = useDocumentContext();
  
  const handleCreateNewDocument = () => {
    createNewDocument();
    toggleMenu();
  };
  
  const handleSaveDocument = async () => {
    const success = await saveDocument();
    if (success) {
      toggleMenu();
    }
  };
  
  const handleOpenDocument = async () => {
    const newDoc = await openDocument();
    if (newDoc) {
      toggleMenu();
    }
  };
  
  return (
    <Animated.View 
      style={[
        styles.drawer,
        {
          transform: [{
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0]
            })
          }]
        }
      ]}
    >
      <View style={styles.drawerContent}>
        <TouchableOpacity style={styles.menuItem} onPress={handleCreateNewDocument}>
          <Ionicons name="document" size={20} color="white" style={styles.menuIcon} />
          <Text style={styles.menuItemText}>New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleSaveDocument}>
          <Ionicons name="save" size={20} color="white" style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleOpenDocument}>
          <Ionicons name="folder-open" size={20} color="white" style={styles.menuIcon} />
          <Text style={styles.menuItemText}>Open</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.3,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 50, 0.4)',
    zIndex: 2,
  },
  drawerContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuItemText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Drawer; 