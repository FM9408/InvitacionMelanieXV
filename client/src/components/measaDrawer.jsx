import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { useNavigate } from "react-router-dom"
import propTypes from 'prop-types'

const MesasDrawer = ({ onDrop, sinMesa, mesaId }) => {
    
    const navigate = useNavigate()


    


    return (
        <Drawer
                variant="permanent"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, 0, mesaId)}
                sx={{
                    width: "35%",
                    '& .MuiDrawer-paper': { width: "35%", p: 2, bgcolor: '#fafafa', borderRight: '1px solid #ddd' }
                }}
            >
                <IconButton onClick={() => navigate(-1)} sx={{ mb: 2, alignSelf: 'flex-start' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Invitados Pendientes</Typography>
                <List sx={{ overflowY: 'auto' }}>
                    {sinMesa.map((inv) => (
                        <ListItem
                            key={inv.id}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData('invitadoId', inv.id)}
                            sx={{
                                bgcolor: 'white',
                                mb: 1,
                                borderRadius: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                cursor: 'grab',
                                '&:active': { cursor: 'grabbing' }
                            }}
                        >
                            <ListItemText primary={inv.nombreCompleto} secondary={inv.familiaNombre} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
    )
};

MesasDrawer.propTypes = {
    onDrop: propTypes.func.isRequired,
    sinMesa: propTypes.array.isRequired
}




export default MesasDrawer