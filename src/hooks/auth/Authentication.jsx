import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "../../utils/firebase";

export const loginAuth = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { status: 200, user: userCredential.user };
  } catch (error) {
    let message = "Terjadi kesalahan, silahkan coba lagi";
    switch (error.code) {
      case "auth/user-not-found":
        message = "Akun tidak ditemukan";
        break;
      case "auth/wrong-password":
      case "auth/invalid-credential":
        message = "Email atau password salah";
        break;
      case "auth/invalid-email":
        message = "Format email tidak valid";
        break;
      case "auth/too-many-requests":
        message = "Terlalu banyak percobaan. Coba lagi nanti";
        break;
      default:
        message = error.message;
    }
    return { status: 400, message };
  }
};

export const registerAuth = async ({ email, password, displayName }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return { status: 200, user: userCredential.user };
  } catch (error) {
    let message = "Terjadi kesalahan, silahkan coba lagi";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "Email sudah terdaftar";
        break;
      case "auth/weak-password":
        message = "Password minimal 6 karakter";
        break;
      case "auth/invalid-email":
        message = "Format email tidak valid";
        break;
      default:
        message = error.message;
    }
    return { status: 400, message };
  }
};

export const logoutAuth = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const checkUser = async () => {
  const user = auth.currentUser;
  if (user) {
    return { status: 200, user };
  }
  return { status: 401, message: "Tidak terautentikasi" };
};
