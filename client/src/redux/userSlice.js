import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        isLoading:true // Initial state is loading
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
            state.isLoading = false // Set loading to false once data is received
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload
        },
        updateCredits:(state,action)=>{
            if(state.userData){
                state.userData.credits = action.payload
            }
        }
    }
})

export const {setUserData , updateCredits, setLoading} = userSlice.actions

export default userSlice.reducer