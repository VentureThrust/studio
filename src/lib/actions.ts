'use server';

import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateDueDiligenceReport } from '@/ai/flows/generate-due-diligence-report';
import { revalidatePath } from 'next/cache';
import { DocumentType, Industry, IndustryDocuments } from './types';

// Helper function to convert file to data URI for GenAI
async function fileToDataURI(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mime = file.type;
  const base64 = buffer.toString('base64');
  return `data:${mime};base64,${base64}`;
}

export async function submitDiligenceReport(formData: FormData) {
  // Hardcoded user for submissions since auth is removed.
  const userId = 'default-user';

  try {
    const basicDetails = {
      startupName: formData.get('startupName') as string,
      email: formData.get('email') as string,
      yearOfRegistration: Number(formData.get('yearOfRegistration')),
      numberOfEmployees: Number(formData.get('numberOfEmployees')),
      field: formData.get('field') as Industry,
    };

    const submissionRef = await addDoc(collection(db, 'submissions'), {
      userId: userId,
      createdAt: serverTimestamp(),
      ...basicDetails,
      documents: {},
      report: 'Generating...',
      status: 'processing',
    });

    const requiredDocs = IndustryDocuments[basicDetails.field];
    const documentUrls: Partial<Record<DocumentType, string>> = {};
    const documentDataURIs: Partial<Record<DocumentType, string>> = {};

    for (const docType of requiredDocs) {
      const file = formData.get(docType) as File | null;
      if (file) {
        // Upload to Firebase Storage
        const storageRef = ref(
          storage,
          `submissions/${submissionRef.id}/${docType}-${file.name}`
        );
        const uploadTask = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        documentUrls[docType] = downloadURL;

        // Convert to data URI for GenAI
        documentDataURIs[docType] = await fileToDataURI(file);
      }
    }

    await updateDoc(doc(db, 'submissions', submissionRef.id), {
      documents: documentUrls,
    });

    // Call GenAI flow
    const reportResult = await generateDueDiligenceReport({
      ...basicDetails,
      ...documentDataURIs,
    });

    await updateDoc(doc(db, 'submissions', submissionRef.id), {
      report: reportResult.report,
      status: 'completed',
    });

    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/submissions/${submissionRef.id}`);

    return { success: true, submissionId: submissionRef.id };
  } catch (error: any) {
    console.error('Submission error:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit diligence report.',
    };
  }
}
