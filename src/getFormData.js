export function formDataFunc(currentTarget){
    let formData = new FormData(currentTarget)
    return Object.fromEntries(formData.entries())
}