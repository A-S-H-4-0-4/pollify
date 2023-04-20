import axios, { AxiosResponse } from "axios";
// import App from "next/app";
const BaseUrl: string = "https://pollify-orcin.vercel.app/api/"

export enum methods {
  GET, POST, PUT, DELETE
}

// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
const instance = axios.create({
  baseURL: BaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }

});

const responseBody = (response: AxiosResponse) => response.data;

export const callAPI = async (API: string, params: object | null = null, method: methods = methods.GET) => {
  let body: {} = {}
  try {
    // let informationObject = {method:'GET'}
    let apiMethod: methods = methods.GET;


    // simple logic
    if (params) {

      switch (method) {
        case methods.DELETE:
          apiMethod = methods.DELETE
          break;
        case methods.PUT:
          apiMethod = methods.PUT
          break;
        default:
          apiMethod = methods.POST;
      }

      // making a post request
      // if (method===methods.DELETE) {


      // }else if(method===methods.POST){
      //     informationObject['method'] = "POST"
      // }else if (method===methods.PUT) {
      //     informationObject['method'] = "POST"
      // }

      // const dataObject = new FormData() 
      // for(const key in params){
      //     dataObject.append(key,params[key])
      // }

      // console.log("data object");
      // console.log(dataObject);
      // informationObject['content-type'] = 'multipart/form-data'/
      // informationObject['body'] = dataObject
      body = params
    } else {
      // making a get request
      // informationObject['headers'] = {

      //     'Content-Type':'application/json'


      //   };
      //   informationObject.method="GET"
      //   informationObject['cache']='no-cache'


    }
    // console.log(informationObject);

    let response: AxiosResponse<any, any>
    let data: {};
    switch (apiMethod) {
      case methods.GET:
        response = await instance.get(API);
        data = responseBody(response);
        console.log(data);
        return data

      case methods.POST:
        response = await instance.post(API, body, {
          headers: {
            "Content-Type": "application/json",
          }
        },);
        data = responseBody(response);
        console.log(data);
        return data
      case methods.PUT:
        response = await instance.put(API, body);
        data = responseBody(response);
        console.log(data);
        return data
      case methods.DELETE:
        response = await instance.delete(API);
        data = responseBody(response);
        console.log(data);
        return data
      default:
        return { 'message': 'contactFailed', 'error': [{ "errorMessage": "Api Failed Alert" }] };
    }


    // const response=  await fetch(BaseUrl+API,informationObject)
    // const result = await response.json()
    // return result

  } catch (error) {
    return error
  }

}