import React from "react";
import { Box, TextField } from "@mui/material";




function BuscarModeDashBoard ({ search, onError,setSearch, onClose, onSave}) { 
    return ( <Box sx={{ mt: -2 }}>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onSave(search);
                                    onClose();
                                }}
                            >
                                <TextField
                                    rows={1}
                                    fullWidth
                                    value={search}
                                    helperText={
                                        onError.state ? onError.message : ''
                                    }
                                    error={onError.state}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>
    </Box>
    )
}


export default BuscarModeDashBoard;

