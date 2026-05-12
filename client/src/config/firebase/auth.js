import { firebaseApp } from ".";
import * as firebaseAuth from "firebase/auth"

export const auth = firebaseAuth.getAuth(firebaseApp);







if (import.meta.env.MODE === "development") {
    firebaseAuth.connectAuthEmulator(auth, "http://localhost:9099", {
        disableWarnings: true
    });
}


export async function login(email, password) {
    try {
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        
        return user;
    } catch (error) {
        throw new Error(error);
    }
}