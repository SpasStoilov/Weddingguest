import { formDataFunc } from "./getFormData"

export function FormEffect(classNameForm){

    let dataFromForm;

    function onSubmitData (e) {
        e.preventDefault();
        console.log(e.currentTarget)
        dataFromForm = formDataFunc(e.currentTarget)
    }

    let formEl = document.querySelector(classNameForm)
    formEl.addEventListener('submit', onSubmitData)
    let cleaner = () => formEl.removeEventListener('submit', onSubmitData)

    return [cleaner, dataFromForm]
        
}