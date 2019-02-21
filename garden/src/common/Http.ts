interface Option<U = any> {
  url: string
  data?: U
  method?: 'POST' | 'GET'
}

function request<T = any, U = any>(option: Option<U>): Promise<T> {
  return new Promise((resolve, reject) => {
    let url = option.url
    let method = option.method || 'POST'
    let data = ''
    if (method === 'POST' && option.data) {
      data = JSON.stringify(option.data)
    }
    if (method === 'GET' && option.data) {
      let arr: string[] = []
      for (let key in option.data) {
        arr.push(`${key}=${option.data[key]}`)

        
      }
      let query = arr.join('&')
      url = `${url}?${query}`
    }
    let xhr = new XMLHttpRequest()
    xhr.onload = () => {
      try {
        let data = JSON.parse(xhr.responseText)
        resolve(data)
        
      } catch (error) {
        reject(error)
      }
    }
    xhr.open(method, url)
    xhr.send(data)
  })
}

/**
 * HTTP POST请求方法
 * @param url
 * @param data
 */
export function post<T = any, U = any>(url: string, data?: any) {
  return request<T, U>({
    url,
    data,
    method: 'POST'
  })
}

/**
 * HTTP GET请求方法
 * @param url
 * @param data
 */
export function get<T, U>(url: string, data?: any) {
  return request({
    url,
    data,
    method: 'GET'
  })
}
