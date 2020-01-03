const $btnPesquisar = document.getElementById("btn_pesquisar");
const $txtPesquisar = document.getElementById("txtPesquisar");
const $imagens = document.getElementById("imagen-artista");
const $musicas = document.getElementById("musicas_artista");
const $infoAutor = document.getElementById("info_autor");   
const $letraMusica = document.getElementById('letra_musica');
const $caixaLetra = document.getElementById("letra");
const $acionaDisplay = document.getElementsByClassName("aciona");
const $todasMusicas = document.getElementById("todas_musicas");
const $topMusicas = document.getElementById("top_musica");
const site = "https://www.vagalume.com.br";
let acomulador = "";
let decisao = false;

//Remove os acentos
const acentoRemover = (especialChar) => {
    const caracterRemovido = especialChar.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return caracterRemovido;
}

/* API - letra das musicas */
const procuraLetra = (idMusica) =>{
    url = `https://api.vagalume.com.br/search.php?musid=${idMusica}&apikey={development}`;
    fetch(url)
        .then(res => res.json())
        .then(res => letraMusica(res.mus[0].text))
}
/* API - Encontra o artista pelo nome */
const encontraDiscografia = (artista) =>{
    nomeArtista = acentoRemover(artista);
    nomeArtista = estilizarNome(nomeArtista);
    console.log(nomeArtista )

    const url = `${site}/${nomeArtista}/index.js`;
    fetch ( url )
        .then( res => res.json())
        .then ( disc => infoAutor( disc ) )
        .catch( () => procuraNomeMusica(nomeArtista));

}

/* API - procura pela musica do autor */
const procuraNomeMusica = (musica) =>{
    const url = `https://api.vagalume.com.br/search.excerpt?apikey=660a4395f992ff67786584e238f501aa&q=${musica}&limit`;

    console.log(url);            
    fetch( url )
        .then( res => res.json())
        .then ( disc => encontraDiscografia( disc.response.docs[0].band ) )            
}

/* Ajuata o nome para procurar na api adicionando o traço "-" */
const ajustaNome = (acc, elemento) => {
    let nome = acc + acomulador + `${elemento}`
    acomulador = "-";
    return nome;
}

/* tranforma o que foi digitado em array separado pelo espaço " " */
const estilizarNome =(text) =>{
    arrayArtista = text.toLowerCase().split(" ");
    artista = arrayArtista.reduce(ajustaNome, "");
    acomulador = "";
    return artista;
}

/* Adiciona a iagem do autor e manda exibir */
const infoAutor = (json) =>{
    $imagens.src = `${site}${json.artist.pic_medium}`;
    exibir(json);
    estilizaCaixa(true);
    console.log(json); 
}

/* exibe na tela o resultado */
const exibir =(json) => {
    let listaMusicas = [];
    if(decisao){
        listaMusicas = json.artist.toplyrics.item;
    }else{
        listaMusicas = json.artist.lyrics.item;
    }
    $musicas.innerHTML = listaMusicas.reduce(exibirMusicas, "");
    $infoAutor.innerHTML = exibirDetalhesAutor(json);
}

/* exibe as musica do auto na tela */
const exibirMusicas = (acc, elemento) =>{
    return acc + ` 
        <div class="musica_album desc">
            <a onclick="procuraLetra('${elemento.id}')">
                <p>${elemento.desc}</p>
            </a>
        </div>
            `;
}

/* exibe detalhes do cantor na tela */
const exibirDetalhesAutor = (json) =>{
    return `
        <h5>Nome: </h5><p>${json.artist.desc}</p><br>
        <h5>Rank: </h5><p>${json.artist.rank.pos}</p><br>
        <h5>Views: </h5><p>${json.artist.rank.views}</p><br>
        <h5>QTD. de Musicas: </h5><p>${json.artist.lyrics.item.length}</p><br>
    `
}

/* traz a letra da musica que foi selecionada */
const letraMusica = (letra) => {
    letra = letra.replace(/\n/g, "<br>");
    estilizaCaixa(false)
    $letraMusica.innerHTML = `${letra}`;
}

/* estiliza conteudos do css */
const estilizaCaixa = ( verifica ) => {
    if(verifica){
        $caixaLetra.style.display = "none";
        mostrarTela($acionaDisplay)
    }else{
        $caixaLetra.style.display = "block";
    }
}

/* utiliza o display block na class adiciona */
const mostrarTela = (elemento) =>{
    for(let i = 0; i < elemento.length; i++){
        $acionaDisplay[i].style.display = "block";
    }
}

/* aciona o meu escolhido, muda a variavel decesao em true ou false e refaz o processo da api */
const opicaoMusica = (result) =>{
    decisao = result;
    encontraDiscografia($txtPesquisar.value);
}

$btnPesquisar.addEventListener("click", 
                                () => 
                                encontraDiscografia($txtPesquisar.value) );

$todasMusicas.addEventListener("click", () => opicaoMusica(false));
$topMusicas.addEventListener("click", () => opicaoMusica(true))                                