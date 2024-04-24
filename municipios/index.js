async function getMunicipio(municipios) {
    try {
      const data = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios
      `)
  
      const jsonData = await data.json()
  
      generateInfoSection(jsonData.view, municipios)
    } catch (error) {
      console.error(error)
    }
  }

  function getSearchParams() {
    if (!location.search) {
      return
    }
  
    const urlSearchParams = new URLSearchParams(location.search)
  
    const nomeMunicipio = urlSearchParams.get('municipios')
  
    changePageTitle(`Pagina do ${nomeMunicipio}`)
    getPokemonData(nomeMunicipio)
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    getSearchParams()
  })

  function generateInfoSection(view, nomeMunicipio) {

    const ul = document.createElement('ul')
    ul.id = "info-estado-label"
    ul.textContent = `Informações sobre ${nomeEstado}`
      
    section.appendChild(h2)
  }