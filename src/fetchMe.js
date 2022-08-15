const baseURL = 'http://localhost:3000/'


function Validator(path, payload){

    if (path == 'register'){

        if (!payload.email){
            alert('Email is empty!')
        }
        else if (!payload.password){
            alert('Password is empty!')
        }
        else if (!payload.repeatPassword){
            alert('repeatPassword is empty!')
        }
        else if (payload.repeatPassword !== payload.password){
            alert('Passwords do not match!')
        }
        else {
            return payload
        }
    }
    else if (path == 'login'){

        if (!payload.email){
            alert('Email is empty!')
        }
        else if (!payload.password){
            alert('Password is empty!')
        }
        else {
            return payload
        }
    }
}



export async function fetchME(method, path, payload={}, token=null){

    console.log(method, path, payload, token)

    try {

        // Validate:
        payload = Validator(path, payload)
        //---------------------------------------------------------------------

        //Fetch data:
       
        if (method === "POST" || method === "PUT"){
            
            payload = {
                method,
                headers: {
                    'Content-Type': "application/json",
                    'X-Authorization': !token ? 'empty': (token).toString()
                },
                body: JSON.stringify(payload)
            }
        }

        console.log("Fetch Peayload: ", payload)

        let response = await fetch(`${baseURL}${path}`, payload)

        if (!response.ok) {
            let statusErr = await response.json()
            throw new Error(statusErr.message)
        }

        if (response.status == 403) { // data exist
            let statusErr = await response.json()
            throw new Error(statusErr.message)
        }

        if (response.status == 204) { // empty
            return []
        }

        return await response.json()

    }
    catch (err){
        console.log(err.message)
        throw err
    }

}