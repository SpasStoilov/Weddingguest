import { fetchME } from "./fetchMe"

export function formDataFunc(currentTarget, method=null, path=null, token=null){
    let formData = new FormData(currentTarget)
    console.log('FormData: ', Object.fromEntries(formData.entries()))

    let payload = Object.fromEntries(formData.entries())

    if (method){
        fetchME(payload, method, path, token)
    }
    
    return payload
}