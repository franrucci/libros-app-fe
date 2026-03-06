// Funciones que se encargaran de conectarse con firebase
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

export const registerWithEmailPassword = async (
    email: string,
    password: string
) => createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmailPassword = async (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);