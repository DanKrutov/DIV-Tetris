function carregarJogo(){
    //limpa mapa antigo
    $('#tela').empty();
    //carrega peça
    escolhepeca(); 
}

function escolhepeca() {
    rand = Math.floor(Math.random() * 5) + 1;
    $("#tela").append('<div id="escolhido" class="escolhido n0 quad'+rand+'"></div>');
    $("#tela").append('<div class="escolhido n1 quad'+rand+'"></div>');
    $("#tela").append('<div class="escolhido n2 quad'+rand+'"></div>');
    $("#tela").append('<div class="escolhido n3 quad'+rand+'"></div>');
    forma = rand;
    atualizaforma(rand, 60, 0, rotacao);
    setTimeout(gravidade, 500);
};

document.onkeydown = function(e) {
    switch(e.which) {
        case 37: case 65:
            move('esq');
        break;
        case 38: case 87: 
            while(move('baixo')){
                move('baixo');
            }   
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
        default: 
            return;
    }
    e.preventDefault();
};

function gravidade(){
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
            $('.escolhido').removeClass('escolhido');
            
            confereTetris();
            escolhepeca();
            return false;
        }
        else {
            setTimeout(gravidade, 500);   
        }
    }
}

function confereTetris(){
    let i;
    //for que passa camada a camada
    for(i=0; i<=17; i++){
        let camada = $('.camada'+i).length;
        console.log("quantidade na camada"+i+":"+$('.camada'+i).length);
        if (camada == 10){
            $('.camada'+i).remove();
            let x = 0;
            for(x=0; x<=i; x++){
                $('.camada'+x).each(function(){
                    val = ($(this).position().top) + 30;
                    $(this).css({ top: val});
                });
            }
            redefineCamadas();
        }
    }
}

function redefineCamadas() {
    let i;
    for(i=0; i<=17; i++){
        $('.quad').removeClass('camada'+i);
    }
    $('.quad').each(function(){
        y = Math.ceil($(this).position().top) / 30
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

    if (colisao(direcao) || semColisao) {
        $('#escolhido').css({ top: posiNovay });
        $('#escolhido').css({ left: posiNovax });
        atualizaforma(rand, posiNovax, posiNovay, rotacao);
        return true
    }

    return false;
};

//funcao responsavel por formar as peças, levando em conta a rotacao e a posicao do div mestre
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
            n2x = n1x + 30;
            n3y = n0y + 30;
        }
        else if (rotacao == 1){
            n1y = n0y + 30;
            n2y = n1y + 30;
            n3x = n0x - 30;
        }
        else if (rotacao == 2){
            n1x = n0x + 30;
            n2x = n1x + 30;
            n3y = n0y - 30;
            n3x = n2x;
        }
        else if (rotacao == 3){
            n1y = n0y + 30;
            n2y = n1y + 30;
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

//garante que as peças da forma não atravessem a parede ao girar, as empurrando de volta
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

pausado = false
formaMapa = [];
rotacao = 0;
forma = null;
carregarJogo();