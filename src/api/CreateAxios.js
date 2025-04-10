import axios from "axios";
import { baseURL } from "./api";
import Cookie from "cookie-universal"
const cookie = Cookie()
const token =cookie.get("e-commerce")

export const NewAxios = axios.create({
    baseURL:baseURL,
    headers:{
        Authorization :`Bearer ${token}`
    }
})