export function formDataFunc(currentTarget){
    let formData = new FormData(currentTarget)
    console.log('FormData: ', Object.fromEntries(formData.entries()))
    return Object.fromEntries(formData.entries())
}