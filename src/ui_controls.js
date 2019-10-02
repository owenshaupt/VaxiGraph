class UIControls {

  
  
  
  receiveUserSelection() {
    const select = document.getElementById('user-country-select');
    select.addEventListener('change', updateGraph(select.value))
  }

  updateGraph(countryCode) {
    const country = countryCode;
    console.log(country);
  }



}

export default UIControls