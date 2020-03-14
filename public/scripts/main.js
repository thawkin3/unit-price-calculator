(function(){
  console.log('hello world!')

  // Global state for our unit price calculator app
  const appState = {
    prices: [],
    unitOfMeasurementPreference: null,
  }

  // Use Promise.allSettled to fetch data from two API endpoints
  // and then populate the product dropdown once both endpoints have responded
  const fetchInitialData = () => {
    const fetchProductsPromise = fetch('/api/products')
      .then(response => response.json())

    const fetchPricesPromise = fetch('/api/prices')
      .then(response => response.json())

    Promise.allSettled([fetchProductsPromise, fetchPricesPromise])
      .then(data => {
        console.log('all settled! here are the results:', data)
        if (data?.[0]?.status === 'fulfilled' && data?.[0]?.status === 'fulfilled') {
          const products = data[0].value?.products
          const prices = data[1].value?.prices
          populateProductDropdown(products)
          savePriceData(prices)
          return
        }
        throw new Error('Missing product or price data')
      })
      .catch(err => console.log('oh no, error! reason:', err))
  }

  const populateProductDropdown = (products = []) => {
    const productDropdown = document.querySelector('#product')
    const productDropdownOptions = products.reduce((optionHtml, product) => {
      return `${optionHtml}<option value="${product.sku}">${product.name}</option>`
    }, '')
    productDropdown.insertAdjacentHTML('beforeend', productDropdownOptions)
  }

  const savePriceData = (prices = []) => {
    appState.prices = prices
  }

  // Fetch some data when the page loads
  fetchInitialData()
})()
