import React from "react";
import { Box, TextField, IconButton, useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


function TextfieldDash ({ familyData, updateMember, onDeleteHandler }) {
    const theme = useTheme()

  
    return (
        <form>
            {familyData.invitados.map(({ nombre, id }, index ) => (
                                        <Box
                                            key={id}
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                    <TextField
                        label={`Integrante ${index + 1}`}
                        fullWidth
                        size='large'
                        error={nombre === ""}
                        color={nombre === "" || !nombre ? theme.palette.error.main : null}
                        helperText={nombre === "" || !nombre ? "El nombre no puede estar en blanco" : null}
                        value={nombre}
                        slotProps={{
                            input: {
                                endAdornment: <IconButton onClick={() => onDeleteHandler(id)}><DeleteIcon/></IconButton>
                            }
                        }}
                        onChange={(e) => {
                                                                                        
                                                                                    
                            updateMember({index: index, value: e.target.value});
                         }}
                                                sx={{ my: 1 }}
                                            />
                                        </Box>
                                    ))}
        </form>
    )
}



export default TextfieldDash;