import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CRBReport } from '@/types';

export const fetchCRBReport = async (reportId: string): Promise<CRBReport | null> => {
  try {
    const reportDoc = await getDoc(doc(db, 'crbReports', reportId));

    if (reportDoc.exists()) {
      return reportDoc.data() as CRBReport;
    }

    return null;
  } catch (error) {
    console.error('Error fetching CRB report:', error);
    throw error;
  }
};
