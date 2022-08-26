const url = `https://maxy-shoplist.herokuapp.com`
const signUpName = document.querySelector('#signup_name-input')
const signUpEmail = document.querySelector('#signup_email-input')
const signUpPassword = document.querySelector('#signup_password-input')
const signUpConfirmPassword = document.querySelector(
    '#signup_conPassword-input'
)
const signUpSubmitBtn = document.querySelector('#signup_submit-btn')
const signUpForm = document.querySelector('#signup_field')

const registerUser = async(e) => {
    e.preventDefault()
    const signUpNameValue = signUpName.value
    const signUpEmailValue = signUpEmail.value
    const signUpPasswordValue = signUpPassword.value
    const signUpConPasswordValue = signUpConfirmPassword.value

    try {
        if (!signUpNameValue || !signUpEmailValue || !signUpPasswordValue) {
            alert('please fill up credentials')
        } else if (signUpPasswordValue !== signUpConPasswordValue) {
            alert('both passwords must match')
        } else {
            const signup = await axios.post(`${url}/auth/register`, {
                name: signUpNameValue,
                email: signUpEmailValue,
                password: signUpPasswordValue,
                confirmPassword: signUpConPasswordValue,
            })
            console.log(signup)
        }
    } catch (error) {
        console.log(error)
    }
}
signUpSubmitBtn.addEventListener('click', registerUser)
signUpForm.addEventListener('submit', registerUser)