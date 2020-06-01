
URL = "http://127.0.0.1:5000/tree"

api  =  {
    get :  () =>{
        return fetch(URL)
        .then(response => response.json())
        .then(data =>  data);
    }
}

export default api;