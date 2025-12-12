import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { RegisterFormData, User } from '@/types';
import { getCurrencyFromCountry } from './currency.service';

export const registerUser = async (data: RegisterFormData): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  const userData: User = {
    uid: userCredential.user.uid,
    email: data.email,
    firstName: data.firstName,
    secondName: data.secondName,
    idNumber: data.idNumber,
    country: data.country,
    currency: getCurrencyFromCountry(data.country),
    createdAt: new Date().toISOString(),
    paymentMade: false,
  };

  await setDoc(doc(db, 'users', userCredential.user.uid), userData);

  return userData;
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const getUserData = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  return null;
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userData = await getUserData(firebaseUser.uid);
      callback(userData);
    } else {
      callback(null);
    }
  });
};
