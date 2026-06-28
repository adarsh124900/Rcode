import { db, doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  studentName: string;
  points: number;
  badges: string[];
  languageProgress: any;
  currentLanguage: string;
  currentChapterId: string;
  currentSessionId: string;
  tutorStyle: string;
  completedChallenges: string[];
}

const DEFAULT_CLASSMATES = [
  { studentName: 'Grace Hopper (Pioneer)', points: 4200, badges: ['Curriculum Complete', 'Quiz Master', 'Python Beginner', 'C++ Pioneer', 'Master of Loops'] },
  { studentName: 'Linus Torvalds (Kernel)', points: 3850, badges: ['C++ Pioneer', 'Master of Loops', 'Quiz Master', 'Perfect Century'] },
  { studentName: 'Ada Lovelace (First)', points: 3400, badges: ['Python Beginner', 'Master of Loops', 'Quiz Master'] },
  { studentName: 'James Gosling (Java)', points: 3100, badges: ['Java Enterprise', 'Quiz Master', 'Perfect Century'] },
  { studentName: 'Guido van Rossum (Python)', points: 2900, badges: ['Python Beginner', 'Quiz Master'] },
  { studentName: 'Dennis Ritchie (C)', points: 2600, badges: ['C++ Pioneer', 'Perfect Century'] },
  { studentName: 'Margaret Hamilton (Apollo)', points: 2200, badges: ['Quiz Master', 'Master of Loops'] }
];

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (uid.startsWith('guest_')) {
    const local = window.localStorage.getItem(`guest_profile_${uid}`);
    if (local) {
      try {
        return JSON.parse(local) as UserProfile;
      } catch (err) {
        console.error('Error parsing guest profile:', err);
      }
    }
    return null;
  }
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
  }
  return null;
}

export async function saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  if (uid.startsWith('guest_')) {
    const localKey = `guest_profile_${uid}`;
    const existing = window.localStorage.getItem(localKey);
    let updated = { ...profile };
    if (existing) {
      try {
        updated = { ...JSON.parse(existing), ...profile };
      } catch (err) {
        console.error('Error parsing guest profile on update:', err);
      }
    }
    window.localStorage.setItem(localKey, JSON.stringify(updated));
    return;
  }
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, profile, { merge: true });
  } catch (err) {
    console.error('Error saving user profile:', err);
  }
}

export async function getLeaderboard(): Promise<any[]> {
  try {
    const usersColl = collection(db, 'users');
    const q = query(usersColl, orderBy('points', 'desc'), limit(15));
    const querySnapshot = await getDocs(q);
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    if (users.length === 0) {
      // Seed with standard default profiles to make it look active and gorgeous
      await seedClassmates();
      return DEFAULT_CLASSMATES.map((c, i) => ({
        id: `mock_user_${i}`,
        studentName: c.studentName,
        points: c.points,
        badges: c.badges,
        email: 'classmate@rcode.com'
      }));
    }

    return users;
  } catch (err) {
    console.error('Error getting leaderboard:', err);
    // Return mock classmates as fallback
    return DEFAULT_CLASSMATES.map((c, i) => ({
      id: `mock_user_${i}`,
      studentName: c.studentName,
      points: c.points,
      badges: c.badges,
      email: 'classmate@rcode.com'
    }));
  }
}

async function seedClassmates() {
  try {
    const usersColl = collection(db, 'users');
    // We can write seed users directly
    for (let i = 0; i < DEFAULT_CLASSMATES.length; i++) {
      const mock = DEFAULT_CLASSMATES[i];
      const mockRef = doc(usersColl, `classmate_${i}`);
      await setDoc(mockRef, {
        uid: `classmate_${i}`,
        email: `classmate_${i}@rcode.com`,
        studentName: mock.studentName,
        points: mock.points,
        badges: mock.badges,
        languageProgress: {},
        currentLanguage: 'python',
        currentChapterId: 'py_ch1',
        currentSessionId: 'py_s1',
        tutorStyle: 'friendly',
        completedChallenges: []
      });
    }
  } catch (err) {
    console.error('Failed to seed classmates:', err);
  }
}
