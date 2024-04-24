function carregarFavoritos() {
    const todoList = document.getElementById('listaFavoritos')
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const li = document.createElement('li')
      li.textContent = localStorage.getItem(key)
  
      todoList.appendChild(li)
    }
  }