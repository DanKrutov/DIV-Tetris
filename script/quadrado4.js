//funcionando bem, mas fora de uso porque quebra o sistema de colisões
function zoom() {
    var width = screen.width;
    if(width >= 1336 && width < 1600){
        document.body.style.zoom = "110%" 
    }
    if(width >= 1600 && width<1920){
        document.body.style.zoom = "130%" 
    }
    else if(width>=1920){
        document.body.style.zoom = "160%" 
    }
}

function carregarNovaPeca(){
    novaPecaCarregada = true;
    escolhepeca(); 
    setTimeout(gravidade, 500);
}

function escolhepeca(definido) {
    if(definido) rand = definido
    else{
        rand = Math.floor(Math.random() * 7) + 1;
    } 

    $("#tela").append('<div id="escolhido" class="escolhido n0 quad'+rand+'"></div>');
    $("#tela").append('<div class="escolhido n1 quad'+rand+'"></div>');
    $("#tela").append('<div class="escolhido n2 quad'+rand+'"></div>');
    $("#tela").append('<div class="escolhido n3 quad'+rand+'"></div>');
    forma = rand;
    atualizaforma(rand, 60, 0, rotacao);
};

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: case 65:
            move('esq');
        break;
        case 38: case 87: 
            do{
                move('baixo');
            }while(move('baixo'));
        break;
        case 39: case 68: 
            move('dir');
        break;
        case 40: case 83:
            move('baixo');
        break;
        case 82:
            rotacionar();
        break;
        case 84:
            guardaEretira();
        break;
        default: 
            return;
    }
    e.preventDefault();
};

function gravidade(){
    try {
        posiNovay = Math.ceil($('#escolhido').position().top) + 30;

        if(!pausado){
            if(!move("baixo")){
                $('#escolhido').removeAttr('id');
                $('.escolhido').addClass('quad');
                $('.escolhido').removeClass('n0 n1 n2 n3');
                    $('.escolhido').each(function(){
                        y = Math.ceil($(this).position().top) / 30
                        $(this).addClass('camada'+y);
                    });
                confereTetris();
                $('.escolhido').removeClass('escolhido');
                carregarNovaPeca();
                return false;
            }
            else {
                setTimeout(gravidade, 500);   
            }
        }
    }
    catch {
        carregarNovaPeca();
        return false;
    }
}

function confereTetris() {
    let i;
    let multiplicador = 0;
    //for que passa camada a camada
    for(i=0; i<=17; i++){
        let camada = $('.camada'+i).length;
        if (camada == 10){
            $('.camada'+i).remove();
            multiplicador++;
            let x = 0;
            for(x=0; x<=i; x++){
                $('.camada'+x).each(function(){
                    val = ($(this).position().top) + 30;
                    $(this).css({ top: val});
                });
            }  
        }
    }
    redefineCamadas();
    if (multiplicador>0){
        pontua(multiplicador);
    }
}

function pontua(mp) {
    if(mp == 1){
        pontuacao += 100;
    }
    else if(mp == 2){
        pontuacao += 300;
    }
    else if (mp == 3){
        pontuacao += 500;
    }
    else if (mp == 4){
        pontuacao += 800;
    }
    $('#inputPontos').val(pontuacao);
    pontuaMax();
}

function pontuaMax(){
    pontuacaoMax = localStorage.getItem('pontuacaoMax');
    if(!pontuacaoMax){
        localStorage.setItem('pontuacaoMax', 0);
        pontuacaoMax = localStorage.getItem('pontuacaoMax');
    }
    if (pontuacao>pontuacaoMax){
        localStorage.setItem('pontuacaoMax', pontuacao);
    } 
    pontuacaoMax = localStorage.getItem('pontuacaoMax') ;
    $('#inputPontosMax').val(pontuacaoMax);
}   

function resetPontuacao(){
    localStorage.setItem('pontuacaoMax', 0);
    pontuacaoMax = localStorage.getItem('pontuacaoMax') ;
    $('#inputPontosMax').val(pontuacaoMax);
    $('#checkReset').prop( "checked", false );
}

function redefineCamadas() {
    let i;
    for(i=0; i<=17; i++){
        $('.quad').removeClass('camada'+i);
    }
    $('.quad').each(function(){
        y = Math.floor(Math.ceil($(this).position().top) / 30)
        $(this).addClass('camada'+y);
    });
}

function pausar(){
    if(pausado){
        pausado = false;
        gravidade();
        $('#btnPause').text("Pausar");
    }
    else{
        pausado = true;
        $('#btnPause').text("Retomar");
    }
}

function rotacionar(){
    if(!pausado){
        if (rotacao == 3){
            rotacao = 0;
        }
        else{
            rotacao++;
        }
        posiAtualx = Math.ceil($('#escolhido').position().left);
        posiAtualy = Math.ceil($('#escolhido').position().top);
        atualizaforma(forma, posiAtualx, posiAtualy, rotacao);
        conferePos();
    }
}

function carregarGrid(){
    let i = 0;
    if ($('#checkGrid').prop('checked')){
        for(i=0; i<180; i++){
            $("#tela").append('<div class="grid"></div>');
        }
    }else{
        $('.grid').remove();
    }
}

function guardaEretira(){
    //OBRIGADO JAVASCRIPT POR SER ESTRANHO E DEIXAR COMPARAR STRING COM NUMERO🛐🛐🛐
    if(forma != ultimaFormaGuardada && !pausado && novaPecaCarregada){
        novaPecaCarregada = false;
        guardar();
        if(ultimaFormaGuardada>0){
            //remove apenas os quads especificados dentro do div #pecaGuardada
            $('#pecaGuardada').parent().find('.quad'+ultimaFormaGuardada).remove();
            //e depois escolhe a peca que foi removida
            escolhepeca(ultimaFormaGuardada);
        }
        //atribuia a var 'forma' antes, mas por ser globalmente usada deu certos conflitos,
        //então agora pego a ultima forma pela classe 'quadX'
        ultimaFormaGuardada = document.getElementsByClassName('guardado')[0].classList[0].slice(-1);
    }
}

//guarda no div #pecaGuardada
function guardar() {
    $(".escolhido").detach().appendTo("#pecaGuardada");
    if(forma == 1){
        atualizaforma(forma, 525, 230, 0);
    }
    else if(forma == 4){
        atualizaforma(forma, 550, 230, 0);
    }else{
        atualizaforma(forma, 570, 230, 0);
    }
    for(i=0; i<=17; i++){
        $('.escolhido').removeClass('camada'+i);
    }
    $('.escolhido').addClass('guardado');
    $('.escolhido').removeClass('n0 n1 n2 n3');
    $('.escolhido').removeClass('escolhido');
    $('#escolhido').removeAttr('id');
}

function move(direcao, semColisao){
    posiNovax = posiAtualx = Math.ceil($('#escolhido').position().left);
    posiNovay = posiAtualy = Math.ceil($('#escolhido').position().top);
    
    if(direcao =="esq"){
        posiNovax = posiAtualx - 30;
    }
    if(direcao =="dir"){
        posiNovax = posiAtualx + 30;
    }
    if(direcao =="baixo"){
        posiNovay = posiAtualy + 30;
    }
    if(direcao =="cima"){
        posiNovay = posiAtualy - 30;
    }

    if (colisao(direcao) || semColisao) {
        $('#escolhido').css({ top: posiNovay });
        $('#escolhido').css({ left: posiNovax });
        atualizaforma(rand, posiNovax, posiNovay, rotacao);
        return true
    }
    return false;
};

//funcao responsavel por formar as peças, levando em conta a rotacao e a posicao
//do div mestre (#escolhido), sinto que tem uma forma mais pratica de fazer isso...
function atualizaforma(forma, posiAtualx, posiAtualy, rotacao){
    n0x = n1x = n2x = n3x = posiAtualx
    n0y = n1y = n2y = n3y = posiAtualy
    if (forma == 1){ //pau
        if (rotacao == 0 || rotacao == 2){
            n1x = n0x + 30;
            n2x = n1x + 30;
            n3x = n2x + 30;
        }
        else if(rotacao == 1 || rotacao == 3){
            n1y = n0y + 30;
            n2y = n1y + 30;
            n3y = n2y + 30;
        }
    }
    else if (forma == 2){ //letra L
        if (rotacao == 0){
            n1x = n0x + 30;
            n2x = n0x - 30;
            n3y = n0y + 30;
            n3x = n2x;
        }
        else if (rotacao == 1){
            n1y = n0y - 30;
            n2y = n0y + 30;
            n3x = n2x - 30;
            n3y = n1y;
        }
        else if (rotacao == 2){
            n1x = n0x - 30;
            n2x = n0x + 30;
            n3y = n0y - 30;
            n3x = n2x;
        }
        else if (rotacao == 3){
            n1y = n0y - 30;
            n2y = n0y + 30;
            n3x = n0x + 30;
            n3y = n2y;
        }
    }
    else if (forma == 3){ //escada
        if (rotacao == 0 || rotacao == 2){
            n1x = n0x + 30
            n2x = n0x - 30;
            n2y = n0y + 30;
            n3y = n2y;
        }
        else if (rotacao == 1 || rotacao == 3){
            n1y = n0y + 30
            n2y = n1y;
            n2x = n1x + 30;
            n3y = n2y + 30;
            n3x = n2x;
        }
    }
    else if (forma == 4){ //quadrado
        n1x = n0x + 30;
        n2y = n0y + 30;
        n3y = n2y;
        n3x = n1x;
    }
    else if (forma == 5){ //letra T
        if (rotacao == 0){
            n1x = n0x - 30;
            n2y = n0y + 30;
            n3x = n0x + 30;
        }
        else if (rotacao == 1){
            n1y = n0y - 30;
            n2x = n0x - 30;
            n3y = n0y + 30;
        }
        else if (rotacao == 2){
            n1x = n0x - 30;
            n2y = n0y - 30;
            n3x = n0x + 30;
        }
        else if (rotacao == 3){
            n1y = n0y - 30;
            n2x = n0x + 30;
            n3y = n0y + 30;
        }
    }
    else if (forma == 6){//escada invertida
        if (rotacao == 0 || rotacao == 2){
            n1x = n0x - 30;
            n2y = n0y + 30;
            n3y = n2y;
            n3x = n2x + 30;
        }
        else if (rotacao == 1 || rotacao == 3){
            n1y = n0y + 30
            n2y = n1y;
            n2x = n1x - 30;
            n3y = n2y + 30;
            n3x = n2x;
        }
    }
    else if (forma == 7){//letra L invertida
        if (rotacao == 0){
            n1x = n0x + 30;
            n2x = n0x - 30;
            n3y = n0y + 30;
            n3x = n1x;
        }
        else if (rotacao == 1){
            n1y = n0y - 30;
            n2y = n0y + 30;
            n3x = n2x - 30;
            n3y = n2y;
        }
        else if (rotacao == 2){
            n1x = n0x - 30;
            n2x = n0x + 30;
            n3y = n0y - 30;
            n3x = n1x;
        }
        else if (rotacao == 3){
            n1y = n0y - 30;
            n2y = n0y + 30;
            n3x = n0x + 30;
            n3y = n1y;
        }
    }
    formaMapa = [
        n0x, n0y,
        n1x, n1y,
        n2x, n2y,
        n3x, n3y,
    ]
    //aplica o formato final nas peças da forma
    $('.n0').css({top: n0y, left: n0x});
    $('.n1').css({top: n1y, left: n1x});
    $('.n2').css({top: n2y, left: n2x});
    $('.n3').css({top: n3y, left: n3x});
};

//garante que as peças da forma não atravessem a parede ao girar, as empurrando de volta pra tela
function conferePos(){
    let i = 0;
    for(i=0; i<4; i++){
        x = Math.ceil($('.n'+i).position().left);
        y = Math.ceil($('.n'+i).position().top);
        if (x < 0){
            move("dir", true);
        }
        else if (x > 299){
            move("esq", true);
        }
        else if (y > 530){
            move("cima", true);
        }
    } 
}

//metodo de colisao
function colisao(direcao){
    var colisaoExiste
    
    //colisão com as bordas da tela
    for(i=0; i<9; i=i+2){
        posinNovax = formaMapa[i];
        posinNovay = (formaMapa[i+1]);
        if(direcao =="esq"){
            posinNovax = formaMapa[i] - 30;
        }
        if(direcao =="dir"){
            posinNovax = formaMapa[i] + 30;
        }
        if(direcao =="baixo"){
            posinNovay = (formaMapa[i+1]) + 30;
        }
        
        if(posinNovay>530 || posinNovay<0 || posinNovax>270 || posinNovax<0){
            colisaoExiste = true;
        }
    }

    //colisão entre as formas
    $('.quad').each(function(){
        this2 = $(this);
        for(i=0; i<9; i=i+2){
            posinNovax = formaMapa[i];
            posinNovay = (formaMapa[i+1]);
            if(direcao =="esq"){
                posinNovax = formaMapa[i] - 30;
            }
            if(direcao =="dir"){
                posinNovax = formaMapa[i] + 30;
            }
            if(direcao =="baixo"){
                posinNovay = (formaMapa[i+1]) + 30;
            }
            
            if(posinNovax == this2.position().left && posinNovay == this2.position().top){
                //condicao para caso a pilha chegue no topo reiniciar...
                if (Math.ceil($(this).position().top) == 30){ 
                    window.location.reload();
                }
                colisaoExiste = true;
            }
        }
    });
    if(colisaoExiste){
        return false;
    }else{
        return true;
    }
};

pausado = false;
guardado = false;
novaPecaCarregada = false;
ultimaFormaGuardada = 0;
listaPecas = [1, 2, 3, 4, 5, 6, 7];
listaPecasEscolhidas = [];
rotacao = 0;
pontuacao = 0;
forma = null;
pontuaMax();
carregarNovaPeca();