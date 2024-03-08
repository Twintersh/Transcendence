export const PROD_MODE = false
export const IP_SERVER = PROD_MODE ? '-ipserver-' : '127.0.0.1:8000'
export const HTTP_MODE = PROD_MODE ? 'https://' : 'http://'