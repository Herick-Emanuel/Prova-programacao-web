async function getEstado(estados) {
    try {
      const data = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
  
      const jsonData = await data.json()
  
      generateInfoSection(jsonData.sprites, estados)
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

  function generateInfoSection(sprites, pokemonName) {
    const imagens = Object.values(sprites)
      .filter(sprite => typeof sprite === 'string')
  
    const h2 = document.createElement('h2')
    h2.id = "info-estado-label"
    h2.textContent = `Informações sobre ${nomeEstado}`
  
    
    const section = document.querySelector('#info-pokemon')
  
    section.appendChild(h2)
  }