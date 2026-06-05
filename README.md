🚀 Guia de Configuração: Projeto Copa Mania
Siga estes passos para configurar seu ambiente de desenvolvimento exatamente como o meu:

1. Preparação
Node.js: Instale a versão LTS mais recente.

Android Studio: Instale com as configurações padrão.

2. Clonagem e Instalação
No terminal:

git clone <link-do-seu-repositorio>

cd <nome-do-projeto>

npm install

3. Configuração do Emulador (Crucial para a Paridade)
No Android Studio, abra o Device Manager.

Clique em Create Device e selecione o Pixel 4.

Passo Fundamental: No System Image, selecione obrigatoriamente a API 33 (Android 13.0 - Google APIs).

Evite versões diferentes para garantir que as sombras, bordas e transparências do nosso design sejam renderizadas exatamente como no meu projeto.

Nas configurações do dispositivo, verifique se a Densidade da tela (Density) está em 440 dpi.

4. Inicialização
Com o Pixel 4 (API 33) aberto, rode no terminal:

Bash
npx expo start
Pressione a tecla a para abrir no Android.
