import React from "react";



const UserContext = React.createContext({
    visited: false,
    user: {
        id: '',
        email:'',
        apellido: '',
        miembros: [],
    },
});


export default UserContext;