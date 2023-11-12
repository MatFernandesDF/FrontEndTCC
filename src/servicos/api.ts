import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AutenticarTokenError } from './erros/AutenticarTokenError'

import { sair } from '../contexts/AutenticarContext'

export function setupAPIClient(ctx = undefined){
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['@digifood.token']}`
    }
  })

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if(error.response.status === 401){
      if(typeof window !== undefined){
        sair();
      }else{
        return Promise.reject(new AutenticarTokenError())
      }
    }

    return Promise.reject(error);

  })

  return api;

}