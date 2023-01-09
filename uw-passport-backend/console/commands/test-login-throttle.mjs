import axios from 'axios'

const testLogin = async () => {
  const params = {
    username: 'foo',
    password: 'bar',
  }
  const url = 'http://localhost:3000/api/auth/login'
  const response = await axios.post(url, params)
  console.log(response.status)
  console.log(response.data)
}

setInterval(testLogin, 1000)
