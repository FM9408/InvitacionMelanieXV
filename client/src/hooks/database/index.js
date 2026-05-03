import axios from "axios"

export async function setConfirmation (willAssist, wontAssist) {
    try {
        await axios.put(`${axios.defaults.baseURL}/api/invitados/setConfirmation`, {
            invitados: {
               willAssist: willAssist,
               wontAssist: wontAssist
           }
       })
    } catch (error) {
        throw new Error(error)
    }
    
   
}
 


export async function setInvitationViewed (familiaId) {
    try {
        await axios.put(
            `${axios.defaults.baseURL}/api/invitados/setInvitationViewed?familiaId=${familiaId}`
        );
    } catch (error) {
        console.log(error);
    
    
    }
}