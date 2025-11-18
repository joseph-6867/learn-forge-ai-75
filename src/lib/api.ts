import { supabase } from "@/integrations/supabase/client";

export interface UploadResponse {
  documentId: string;
  message: string;
}

export interface ProcessingResponse {
  success: boolean;
  message: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const api = {
  // Upload and process document
  uploadDocument: async (file: File): Promise<UploadResponse> => {
    // Upload file to Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create document record
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: uploadData.path,
      })
      .select()
      .single();

    if (docError) throw docError;

    return {
      documentId: docData.id,
      message: "Document uploaded successfully"
    };
  },

  // Process document (extract text and generate content)
  processDocument: async (documentId: string, extractedText: string): Promise<ProcessingResponse> => {
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: { documentId, extractedText }
    });

    if (error) throw error;
    return data;
  },

  // Get document by ID
  getDocument: async (documentId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get summary for document
  getSummary: async (documentId: string) => {
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  // Get flashcards for document
  getFlashcards: async (documentId: string) => {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get quiz for document
  getQuiz: async (documentId: string) => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Chat with document
  chatWithDocument: async (documentId: string, message: string, documentText: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('chat-with-document', {
      body: { documentId, message, documentText }
    });

    if (error) throw error;
    return data.response;
  },

  // Get chat history
  getChatHistory: async (documentId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get all user documents
  getUserDocuments: async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
