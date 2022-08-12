const baseURL = 'http://localhost:3030'


function Validator(path, payload){

    if (path == '/register'){

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
}



export async function fetchME(payload=null, method=null, path=null, token=null){

    //       GET  /register {email, password, repat-password}
    console.log(payload, method, path, token)

    // validate:
    payload = Validator(path, payload)
    //---------------------------------------------------------------------

    //fetch data:
    let data = {}

    if (method === "POST"){
        data = {
            method,
            headers:{
                'Content-Type': "application/json",
                'X-Authorization': !token ? 'empty': (token).toString()
            },
            body: JSON.stringify(payload)
        }
    }

    try {

        let response = await fetch(`${baseURL}${path}`, data)

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
    }

}