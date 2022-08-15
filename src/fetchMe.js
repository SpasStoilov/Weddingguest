const baseURL = 'http://localhost:3030/'


function Validator(path, payload){

    if (path === 'register'){

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
    else if (path === 'login'){

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

            let auth = !token ? 'empty': (token).toString()

            let DATA = {
                method,
                headers: {
                    'Content-Type': "application/json",
                    'X-Authorization': auth
                },
                body: JSON.stringify(payload)
            }
            payload = DATA
        }

        console.log("Fetch Peayload: ", payload)
        console.log("Fetch Path: ", `${baseURL}${path}`)
        let response = await fetch(`${baseURL}${path}`, payload)

        if (!response.ok) {
            let statusErr = await response.json()
            throw new Error(statusErr.message)
        }

        return await response.json()

    }
    catch (err){
        console.log(err.message)
    }

}