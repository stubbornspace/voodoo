import React, { createContext, useState, useContext } from 'react';
import DocumentService from '../services/DocumentService';

// Create the context
const DocumentContext = createContext();

// Custom hook to use the document context
export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

// Provider component
export const DocumentProvider = ({ children }) => {
  // Document state
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState({
    id: 'initial',
    title: 'Untitled',
    content: '',
    createdAt: new Date().toISOString(),
  });
  const [documentContent, setDocumentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Document operations
  const createNewDocument = () => {
    const newDoc = DocumentService.createNewDocument();
    setDocuments([...documents, newDoc]);
    setCurrentDocument(newDoc);
    setDocumentContent('');
    return newDoc;
  };

  const saveDocument = async () => {
    setIsSaving(true);
    const success = await DocumentService.saveDocument(documentContent, currentDocument);
    setIsSaving(false);
    return success;
  };

  const openDocument = async () => {
    const newDoc = await DocumentService.openDocument();
    if (newDoc) {
      setDocuments(prevDocs => [...prevDocs, newDoc]);
      setCurrentDocument(newDoc);
      setDocumentContent(newDoc.content);
      return newDoc;
    }
    return null;
  };

  const switchDocument = (docId) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setCurrentDocument(doc);
      setDocumentContent(doc.content);
      return true;
    }
    return false;
  };

  const updateDocumentContent = (content) => {
    setDocumentContent(content);
    // Update the current document's content in the documents array
    if (currentDocument.id !== 'initial') {
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === currentDocument.id 
            ? { ...doc, content } 
            : doc
        )
      );
    }
  };

  // Context value
  const value = {
    // State
    documents,
    currentDocument,
    documentContent,
    isSaving,
    
    // Operations
    createNewDocument,
    saveDocument,
    openDocument,
    switchDocument,
    updateDocumentContent,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContext; 