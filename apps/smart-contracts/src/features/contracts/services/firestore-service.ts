import { auth, db } from "@services/firebase-config";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { Contract } from "@features/contracts/models";
import { onAuthStateChanged } from "firebase/auth";

const contractsCollection = collection(db, "contracts");

export const createContract = async (contract: Contract) => {
  const docRef = await addDoc(contractsCollection, contract);
  return docRef.id;
};

export const getContract = async (contractId: string) => {
  const docRef = doc(db, "contracts", contractId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Contract not found");
  }
  return docSnap.data() as Contract;
};

/**
 * מאזין לחוזים של היוזר הנוכחי בזמן אמת
 * @param callback מקבל מערך טיפוסי של חוזים
 */
export const listenToContracts = (
  callback: (contracts: Contract[]) => void
) => {
  let unsubscribeFirestore: (() => void) | null = null;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }

    if (user) {
      const contractsRef = collection(db, "contracts");
      const q = query(
        contractsRef,
        where("createdBy", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const contracts: Contract[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Contract, "id">),
        }));
        callback(contracts);
      });
    } else {
      callback([]); // אין יוזר? רשימה ריקה
    }
  });

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    unsubscribeAuth();
  };
};

/**
 * מאזין לחוזה בודד בזמן אמת
 * @param contractId מזהה החוזה
 * @param callback פונקציה שמקבלת את החוזה או null אם לא קיים
 * @returns פונקציית ביטול ההאזנה
 */
export const listenToContract = (
  contractId: string,
  callback: (contract: Contract | null) => void
) => {
  const docRef = doc(db, "contracts", contractId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as Contract);
      } else {
        callback(null);
      }
    },
    (error) => {
      callback(null);
    }
  );
};

export const updateContract = async (
  contractId: string,
  data: Partial<Contract>
) => {
  const docRef = doc(db, "contracts", contractId);
  await updateDoc(docRef, data);
};

export const deleteContract = async (contractId: string) => {
  const docRef = doc(db, "contracts", contractId);
  await deleteDoc(docRef);
};
