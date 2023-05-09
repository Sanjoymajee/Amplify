const ajax = (url,successCallback,errorCallBack) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const response = JSON.parse(xhr.responseText);
                successCallback(response);
            }
            else{
                errorCallBack(xhr.statusText);
            }
        }
    };
    xhr.open('GET',url);
    xhr.send();
}