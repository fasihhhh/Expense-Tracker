let URL = 'http://127.0.0.1:3000/users';

export default async function getData() {
    try {
        let response = await fetch(URL);
        let data = await response.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
getData()

// export default getData()