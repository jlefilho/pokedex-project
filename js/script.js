//variáveis HTML
const $pokemonName = document.querySelector('.pokemonName')
const $pokemonID = document.querySelector('.pokemonID')
const $pokemonImg = document.querySelector('#pokemonImg')
const $form = document.querySelector('.form')
const $inputSearch = document.querySelector('.inputSearch')
const $btnInfo = document.querySelector('.btnInfo')
const $btnPrev = document.querySelector('.btnPrev')
const $btnNext = document.querySelector('.btnNext')
const $pokemonInfo = document.querySelector('.pokemonInfo')
$pokemonInfo.style.display = 'none' //começar com display none
const $pokemonInfoName = document.querySelector('.pokemonInfoName')
const $pokemonInfoID = document.querySelector('.pokemonInfoID')
const $pokemonInfoType = document.querySelector('.pokemonInfoType')
const $pokemonInfoAbilities = document.querySelector('.pokemonInfoAbilities')
const $pokemonInfoStats = document.querySelector('.pokemonInfoStats')

//index inicial
let pokemonIndex = 1

//conexão com API
const fetchAPI = async (pokemon) => { //função assíncrona para aguardar resposta antes de prosseguir
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    
    if (APIResponse.status === 200) { //checa se a conexão com a API está OK
        const dataJSON = await APIResponse.json() //resposta da API convertida em JSON
        return dataJSON
    }    
}

//renderizar Pokemon
const renderPokemon = async (pokemon) => { //necessita aguardar a fetchAPI responder
    
    //retira/limpa itens enquanto carrega a API
    $pokemonID.innerHTML = ''
    $pokemonName.innerHTML = "Loading..." 
    $pokemonImg.style.display = 'none'
    $pokemonInfoType.innerHTML = ''
    $pokemonInfoName.innerHTML = "Loading..."
    $pokemonInfoAbilities.innerHTML = ''
    $pokemonInfoStats.innerHTML = ''
        
    const pokemonData = await fetchAPI(pokemon) //dados do pokemon acessado
    
    //validação de dados da API
    if (pokemonData) { //se houver resposta, renderizar
        $pokemonID.innerHTML = `${pokemonData.id} -`
        $pokemonName.innerHTML = pokemonData.name
        $pokemonInfoName.innerHTML = pokemonData.name
        $pokemonInfoID.innerHTML = `(${pokemonData.id })` 
        $pokemonImg.src = pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default
        $pokemonImg.style.display = 'block' //mostra imagem
        $inputSearch.value = '' //limpa o campo
        pokemonIndex = pokemonData.id //muda o index para o pokemon requisitado

        //variáveis para listas de infos
        const pokemonAbilities = pokemonData.abilities
        const pokemonTypes = pokemonData.types
        const pokemonStats = pokemonData.stats

        //Types List
        for (i=0; i < pokemonTypes.length; i++) {
            $pokemonInfoType.innerHTML += `${pokemonData.types[i].type.name}<br>`
        }

        //Abilities List
        for (i=0; i < pokemonAbilities.length; i++) {
            $pokemonInfoAbilities.innerHTML += `${pokemonAbilities[i].ability.name}<br>`            
        }
              
        //Stats List and Values
        for (i=0; i < pokemonStats.length; i++) {
            $pokemonInfoStats.innerHTML += `${pokemonStats[i].stat.name}: ${pokemonStats[i].base_stat}<br>`
        }

    } else { //se não, mensagem de erro e esconde imagem
        $pokemonName.innerHTML = `Not Found :'(`
        $pokemonID.innerHTML = ''
        $pokemonImg.style.display = 'none' //esconde imagem
        $inputSearch.value = '' //limpa o campo
        $pokemonInfo.style.display = 'none'       
    }
}

//pesquisa por formulário
$form.addEventListener('submit', (event) => {
    event.preventDefault();  //previne enviar o form em branco
    renderPokemon($inputSearch.value.toLowerCase()) //renderiza o valor digitado no input (precisa ser em minúsculas para a requisição da API)
    
})

//botões para subir/descer index (valor mínimo 1)
$btnPrev.addEventListener('click', () => { 
    if (pokemonIndex > 1) { //não deixar index ser 0
        pokemonIndex-- 
        renderPokemon(pokemonIndex)
    }        
})

$btnNext.addEventListener('click', () => {
    pokemonIndex++
    renderPokemon(pokemonIndex)    
})

//botão de infos (show/hide)
$btnInfo.addEventListener('click', () => {
    if ($pokemonInfo.style.display == 'none' && $pokemonID.innerHTML != '') { //escondido e sem erro
        $pokemonInfo.style.display = 'flex'
    } else {
        $pokemonInfo.style.display = 'none'
    }
})

renderPokemon(pokemonIndex)

