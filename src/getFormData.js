import { fetchME } from "./fetchMe"

export function formDataFunc(currentTarget, method=null, path=null, token=null){
    let formData = new FormData(currentTarget)
    console.log('FormData: ', Object.fromEntries(formData.entries()))

    let payload = Object.fromEntries(formData.entries())

    if (method && path){
        let response = fetchME(method, path, payload, token)
        return response
    }
    
    return payload
}