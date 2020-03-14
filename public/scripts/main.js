(function(){
  console.log('hello world!')

  // Use Promise.allSettled to fetch data from two API endpoints
  // and then take an action once both endpoints have responded
  const fetchInitialData = () => {
    const promise1 = new Promise((resolve, reject) => setTimeout(() => resolve('promise 1 resolved!'), 100))
    const promise2 = new Promise((resolve, reject) => setTimeout(() => resolve('promise 2 resolved!'), 200))

    Promise.allSettled([promise1, promise2])
      .then(data => console.log('all settled! here are the results:', data))
      .catch(err => console.log('oh no, error! reason:', err))  
  }

  fetchInitialData()
})()
