const url = `https://maxy-shoplist.herokuapp.com/api/v1`
const signUpName = document.querySelector('#signup_name-input')
const signUpEmail = document.querySelector('#signup_email-input')
const signUpPassword = document.querySelector('#signup_password-input')
const signUpConfirmPassword = document.querySelector(
    '#signup_conPassword-input'
)
const signUpSubmitBtn = document.querySelector('#signup_submit-btn')
const signUpForm = document.querySelector('#signup_field')
const alertMsgContainer = document.querySelector('#signup-alert-msg_container')
const alertMsg = document.querySelector('#signup-alert_msg')
const loadingMsg = document.querySelector('#signup-loading_msg')
const registerUser = async(e) => {
    e.preventDefault()
    const signUpNameValue = signUpName.value
    const signUpEmailValue = signUpEmail.value
    const signUpPasswordValue = signUpPassword.value
    const signUpConPasswordValue = signUpConfirmPassword.value
    alertMsgContainer.classList.add('hide-msg_container')
    loadingMsg.innerHTML = 'Loading...'
    try {
        if (!signUpNameValue || !signUpEmailValue || !signUpPasswordValue) {
            loadingMsg.innerHTML = ''
            alertMsg.innerHTML = 'Please fill up credentials'
        } else if (signUpPasswordValue !== signUpConPasswordValue) {
            loadingMsg.innerHTML = ''
            alertMsg.innerHTML = 'Both passwords must match'
        } else {
            await axios.post(`${url}/auth/register`, {
                name: signUpNameValue,
                email: signUpEmailValue,
                password: signUpPasswordValue,
                confirmPassword: signUpConPasswordValue,
            })
            alertMsg.innerHTML = ''
            loadingMsg.innerHTML = ''
            window.location.href = './Pages/login.html'
        }
    } catch (error) {
        loadingMsg.innerHTML = ''
        const {
            response: {
                data: { msg },
            },
        } = error
        alertMsg.innerHTML = msg.split(',').join('')
    }

    localStorage.removeItem('username')
    localStorage.removeItem('accessToken')

    setTimeout(() => {
        alertMsgContainer.classList.remove('hide-msg_container')
        alertMsg.innerHTML = ''
    }, 1000)
}
signUpSubmitBtn.addEventListener('click', registerUser)
signUpForm.addEventListener('submit', registerUser)