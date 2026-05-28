import React from "react";
import TextfieldDash from "../../components/Textfield";
import { Box, Button, TextField,  } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';







function EditModeDashBoard ({ familyData, updateMember, addMember, setFamilyData}) {
   
  
  function onDeleteHandler (id) {
          const filter = familyData.invitados.filter((inv) => inv.id !== id)
         setFamilyData({...familyData, invitados: filter})
       
    }


    return (
         <Box sx={{ width: '100%', textAlign: 'center' , justifyContent: "flex-start", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <TextField
                                    label='Apellido de la Familia'
                                    fullWidth
                value={familyData.nombreFamilia}
                onChange={(e) => {
                    setFamilyData({
                        nombreFamilia: e.target.value,
                        invitados: [...familyData.invitados],
                        id: familyData.id
                        
                })}}

                                />
                               <TextfieldDash onDeleteHandler={onDeleteHandler} familyData={familyData} updateMember={updateMember} />
                                <Button startIcon={<AddIcon />} onClick={() => addMember()} variant="contained">
                                    Agregar Miembro
                                </Button>
                            </Box>
    )
}

export default EditModeDashBoard;
    
