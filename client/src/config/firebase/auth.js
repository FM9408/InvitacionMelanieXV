import { firebaseApp } from ".";
import * as firebaseAuth from "firebase/auth"

export const auth = firebaseAuth.getAuth(firebaseApp);







if (import.meta.env.MODE === "development") {
    firebaseAuth.connectAuthEmulator(auth, "http://localhost:9099", {
        disableWarnings: true
    });
}


export async function login (email, password) {
    try {
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        
        return user;
    } catch (error) {
        switch (error.code) {
            case "auth/wrong-password":
                throw new Error("Contraseña incorrecta");

                
            case "auth/user-not-found":
                throw new Error("Email incorrecto");

                
            default:
                throw new Error("Error al iniciar sesión");
        

        
           
        
        }
    }
}