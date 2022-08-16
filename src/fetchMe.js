const baseURL = 'http://localhost:3030'


function Validator(path, payload){

    if (path === '/register'){

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
    }
    else if (path === '/login'){

        if (!payload.email){
            alert('Email is empty!')
        }
        else if (!payload.password){
            alert('Password is empty!')
        }
       
    }
    return payload
}



export async function fetchME(method, path, payload={}, token=null, flag=false){

    console.log(method, path, payload, token)

    // Validate:
    payload = Validator(path, payload)
    //---------------------------------------------------------------------

    let auth = token ? token: 'empty'
    
    //Fetch data:
    if (method === "POST" || method === "PUT"){

        let headers = {
            'x-authorization': auth,
            'Content-Type':"application/json"
        }

        if (flag){
            headers = {
                'x-authorization': auth,
            }
        }

        let DATA = {
            method,
            headers,
            body: flag ? payload : JSON.stringify(payload)
        }
        payload = DATA
    }
    else if (method === "GET"){
        payload = {
            headers: {'x-authorization': auth}
        }
    }

    console.log("Fetch Peayload: ", payload)
    console.log("Fetch Path: ", `${baseURL}${path}`)
    let response = await fetch(`${baseURL}${path}`, payload)

    if (!response.status === 404) {
        let statusErr = await response.json()
        throw new Error(statusErr.message)
    }

    return response

}