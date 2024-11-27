import axios from "axios";

const instance = axios.create({
    baseURL: 'https://nomiwise.onrender.com/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
})

export default instance;