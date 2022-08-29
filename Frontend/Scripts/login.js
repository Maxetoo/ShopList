const url = `https://maxy-shoplist.herokuapp.com/api/v1`

const loginForm = document.querySelector('#login_field')
const loginEmail = document.querySelector('#login_email-input')
const loginPassword = document.querySelector('#login_password-input')
const loginBtn = document.querySelector('#login_submit-btn')
const alertMsgContainer = document.querySelector('#login-alert-msg_container')
const alertMsg = document.querySelector('#login-alert_msg')
const loadingMsg = document.querySelector('#login-loading_msg')

const loginUser = async(e) => {
    e.preventDefault()
    const loginEmailValue = loginEmail.value
    const loginPasswordValue = loginPassword.value
    alertMsgContainer.classList.add('hide-msg_container')
    loadingMsg.innerHTML = 'Loading...'

    try {
        if (!loginEmailValue || !loginPasswordValue) {
            loadingMsg.innerHTML = ''
            alertMsg.innerHTML = 'Please fill up credentials'
        } else {
            loadingMsg.innerHTML = 'Loading...'
            const {
                data: { token, username },
            } = await axios.post(`${url}/auth/login`, {
                email: loginEmailValue,
                password: loginPasswordValue,
            })
            localStorage.setItem('username', username)
            localStorage.setItem('accessToken', token)
            window.location.href = '../Pages/home.html'
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

    setTimeout(() => {
        alertMsgContainer.classList.remove('hide-msg_container')
        alertMsg.innerHTML = ''
        loadingMsg.innerHTML = ''
    }, 1000)
}

loginForm.addEventListener('submit', loginUser)
loginBtn.addEventListener('click', loginUser)