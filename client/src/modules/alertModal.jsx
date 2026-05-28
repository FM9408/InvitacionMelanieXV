import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Grid } from '@mui/material';

export default function AlertaAsistencia ({ tieneConfirmacion, setModalOpen, onClose }) {
    // El modal se abre automáticamente si el usuario no ha confirmado la asistencia

  
    //
    const handleClose = () => {
      onClose();
      
    };

    
    


  return (
    <Dialog open={tieneConfirmacion} onClose={handleClose} sx={{width:"100%", display:"flex", justifyContent: "center", alignItems: "center"}}>
          <DialogTitle sx={{ display: "inline-flex", justifyContent: "center", alignItems: "center", width: "100%", p: -2, m: 0 }}>
              <Grid container direction="column" >
                  <Grid item sx={{width:"100%", display:"inline-flex", justifyContent: "center", alignItems: "center", mb:-2}}>
                      ⚠️
                  </Grid>
                  <Grid item sx={{width:"100%", display:"inline-flex", justifyContent: "center", alignItems: "center", mt:-2}}>
                      <Typography variant="alertFont" sx={{display:"inline-flex", width:"100%", justifyContent: "center", alignItems: "center" }}>Confirmaciones pendientes</Typography>
                  </Grid>
              </Grid>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
                  Parece ser que algunos miembros de tu familia no han confirmado o rechazdo su asistencia. Es importante que confirmen su asistencia de lo contrario no se le podrá asignar una mesa,
                  y no podremos asegurarle una silla el día del evento.
              </DialogContentText>
              <DialogActions>
                  <Grid container direction="row" sx={{width:"100%"}} >
                      <Grid item sx={{width:"50%", display:"flex", justifyContent: "center", alignItems: "center"}}>
                          <Button variant="contained" color="primary" onClick={() => {
                              handleClose();
                              setModalOpen(true);
                                }
                          }>
                              <Typography variant="button">Confirmar Asistencias</Typography>
                          </Button>
                      </Grid>
                      <Grid item sx={{width:"50%", display:"flex", justifyContent: "center", alignItems: "center"}}>
                          <Button variant="contained" color="error" onClick={handleClose}>
                              <Typography variant="button">Lo haré después</Typography>
                          </Button>
                      </Grid>
                  </Grid>
              </DialogActions>
      </DialogContent>
      {/* El siguiente paso será agregar los botones de acción aquí */}
    </Dialog>
  );
}