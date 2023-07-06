/* ****Ao carregar a página o código que está fora de funções será executado
O botão iniciar deverá ter um evento click que ao ser clicado chama a 
função iniciar
document.querySelector("#btnIniciar").addEventListener("click", () => { iniciar() });

Os procedimentos que vc quer executar somente uma vez ficam fora das funções.
Os procedimentos que vc quer executar todavez que reiniciar o jogo
devem estar na função iniciar

*********** Botão iniciar
Colocar todos procedimentos iniciais em uma função iniciar.
Esta função é chamada pelo botão iniciar
Para que as variaveis declaradas dentro da função tenham 
visibilidade global deve-se defini-las sem o let
(o melhor é declara-las globalmente antes)

********Para terminar o jogo
-mostrar imagens e mensagens de fim de jogo 
-Fechar todos timers com clear interval

        timer = setInterval("func()", 100);
        ...
        clearInterval(timer);

-Terminar os procedimentos necessários
-mostrar o botão/div reiniciar

********** Botão/Div reiniciar
Reinicia o valor de todas as variáveis e faz os procedimentos de 
início do jogo (similar ao botão iniciar)(em alguns casos ele
pode simplesmente chamar a função iniciar)


//som

musica = new Audio('../audio/musica.mp3');
musica.play();
musica.pause();

musica.load();
musica.play();
musica.volume = 0.05;
musica.loop = true;