import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useDocumentContext } from '../contexts/DocumentContext';

const Editor = () => {
  const { documentContent, updateDocumentContent } = useDocumentContext();
  
  return (
    <View style={styles.editorContainer}>
      <TextInput
        style={styles.editor}
        multiline
        value={documentContent}
        onChangeText={updateDocumentContent}
        placeholder="Make it so"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editor: {
    flex: 1,
    color: 'white',
    fontSize: 24,
    lineHeight: 32,
    borderRadius: 10,
    padding: 15,
    maxWidth: 800,
    width: '100%',
    marginTop: 40,
  },
});

export default Editor; 