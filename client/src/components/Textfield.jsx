import React from "react";

function TextfieldDash ({familyData, updateMember}) {
    return (
        <Box>
             {familyData.invitados.map((inv, i) => (
                                        <Box
                                            key={inv.id}
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            <TextField
                                                label={`Integrante ${i + 1}`}
                                                fullWidth
                                                size='small'
                                                value={inv.nombre}
                                                onChange={(e) =>
                                                    updateMember(inv.id, e.target.value)
                                                }
                                                sx={{ my: 1 }}
                                            />
                                        </Box>
                                    ))}
        </Box>
    )
}



export default TextfieldDash;