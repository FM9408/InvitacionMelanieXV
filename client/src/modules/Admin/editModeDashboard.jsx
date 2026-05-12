import React from "react";
import TextfieldDash from "../../components/Textfield";
import { Box, Button, TextField } from "@mui/material";






function EditModeDashBoard ({familyData, updateMember, addMember, setFamilyData}) {
    return (
         <Box>
                                <TextField
                                    label='Apellido de la Familia'
                                    fullWidth
                                    value={familyData.nombreFamilia}
                                    onChange={(e) =>
                                        setFamilyData({
                                            ...familyData,
                                            nombreFamilia: e.target.value,
                                        })
                                    }
                                />
                               <TextfieldDash familyData={familyData} updateMember={updateMember} />
                                <Button onClick={() => addMember()}>
                                    Agregar Miembro
                                </Button>
                            </Box>
    )
}

export default EditModeDashBoard;
    
