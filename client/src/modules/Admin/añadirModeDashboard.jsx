
import React from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";




function AñadirModeDashboard ({familyData, updateMember, addMember, removeMember, setFamilyData}) {
    return (
         <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 1,
                        }}
                    >
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
                        <Typography variant='subtitle2'>
                            Miembros de la familia:
                        </Typography>
                        {familyData.invitados.map((inv, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    label={`Integrante ${index + 1}`}
                                    fullWidth
                                    size='small'
                                    value={inv.nombre}
                                    onChange={(e) =>
                                        updateMember(index, e.target.value)
                                    }
                                />
                                <IconButton
                                    onClick={() => removeMember(index)}
                                    color='error'
                                    disabled={familyData.invitados.length === 1}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<Add />}
                            onClick={addMember}
                            variant='outlined'
                        >
                            Agregar Miembro
                        </Button>
                    </Box>
    )
}

export default AñadirModeDashboard;
