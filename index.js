async function getEstado(estados) {
    try {
      const data = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
  
      const jsonData = await data.json()
  
      generateInfoSection(jsonData.view, estados)
    } catch (error) {
      console.error(error)
    }
  }
  
  function getSearchParams() {
    if (!location.search) {
      return
    }
  
    const urlSearchParams = new URLSearchParams(location.search)
  
    const nomeEstado = urlSearchParams.get('estados')
  
    changePageTitle(`Pagina do ${nomeEstado}`)
    getPokemonData(nomeEstado)
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    getSearchParams()
  })

  function generateInfoSection(nomeEstado) {

    const ul = document.createElement('ul')
    ul.id = "info-estado-label"
    ul.textContent = `Informações sobre ${nomeEstado}`
      
    section.appendChild(h2)
  }