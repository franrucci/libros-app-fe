import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
    type Dispatch,
} from "@reduxjs/toolkit";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import type { RootState } from "../store/store";
import { firebaseAxios } from "../config/axios";

export interface AuthUser {
    uid: string;
    email: string | null;
    token: string;
}

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null, // el usuario logueado
    loading: true, // si está autenticando
    error: null, // si hubo error
};

// Register new user: Llama a createUserWithEmailAndPassword. Firebase crea el usuario. Obtiene el token. Devuelve un objeto.
export const registerUser = createAsyncThunk<
    AuthUser,
    { email: string; password: string; name: string; lastName: string },
    { rejectValue: string }
>("auth/registerUser", async ({ email, password, name, lastName }, { rejectWithValue }) => {
    try {
        // Crea usuario en Firebase
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Obtiene el token
        const token = await user.getIdToken();

        // Guarda usuario en Mongo usando la instancia
        await firebaseAxios.post("/user/register", {
            name,
            lastName,
            email,
            firebaseUid: user.uid,
        });

        return {
            uid: user.uid,
            email: user.email,
            token,
        };

    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || error.message
        );
    }
});


// Login
export const loginUser = createAsyncThunk<
    AuthUser,
    { email: string; password: string },
    { rejectValue: string; dispatch: Dispatch }
>(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue, dispatch }) => {
        try {
            dispatch(setLoading(true));
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const userToken = await userCredential.user.getIdToken();
            localStorage.setItem("token", JSON.stringify(userToken));

            const user = userCredential.user;
            return {
                uid: user.uid,
                email: user.email,
                token: await user.getIdToken(),
            };
        } catch (error: any) {
            let message = "Ocurrió un error al iniciar sesión";

            if (error.code === "auth/invalid-credential") {
                message = "Email o contraseña incorrectos";
            }

            if (error.code === "auth/user-not-found") {
                message = "El usuario no existe";
            }

            if (error.code === "auth/wrong-password") {
                message = "Contraseña incorrecta";
            }

            return rejectWithValue(message);
        }
        finally {
            dispatch(setLoading(false));
        }
    }
);

export const logoutUser = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        await signOut(auth);
        localStorage.removeItem("token");
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});


// Observe Firebase user state: la forma de checkear si se esta logueado. Esto es lo que mantiene la sesión activa al recargar la página.
// Firebase detecta automáticamente: Si el usuario ya estaba logueado. Si cerró sesión. Si la sesión expiró.
export const observeUser = createAsyncThunk<void, void, { dispatch: Dispatch }>(
    "auth/observeUser",
    async (_, { dispatch }) => {
        onAuthStateChanged(auth, async (user: User | null) => {
            dispatch(setLoading(true));
            if (user) {
                const token = await user.getIdToken();
                dispatch(setUser({ uid: user.uid, email: user.email, token }));
            } else {
                dispatch(clearUser());
            }
            dispatch(setLoading(false));
        });
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // setUser: Sirve para guardar el usuario en Redux.
        setUser: (state, action: PayloadAction<AuthUser>) => {
            state.user = action.payload;
        },
        // clearUser: Sirve para desloguear.
        clearUser: (state) => {
            state.user = null;
        },
        // setLoading: para cuando esta en proceso la autenticacion.
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });

    },
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const getAuthState = (state: RootState) => state.auth;
export default authSlice.reducer;