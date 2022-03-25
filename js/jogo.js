let jogo = class {
    _palavraEscolhida = "";
    _monitorAtualDaLetra = [0, 0];

    get palavraEscolhida() {
        return this._palavraEscolhida;
    }

    get linhaAtual() {
        return this._monitorAtualDaLetra[0];
    }

    get letraAtual() {
        return this._monitorAtualDaLetra[1];
    }

    get queryMonitorAtual() {
        let linha = this.linhaAtual;
        let monitorLetra = this.letraAtual;
        let query = this._getQueryMonitor(linha, monitorLetra);

        return query;
    }

    get elementoAtual() {
        let query = this.queryMonitorAtual;
        return document.querySelector(query);
    }

    get classeCSSLetraDigitada() {
        return "letraDigitada";
    }

    set monitoresDasLetras(valor) {
        this._monitorAtualDaLetra = valor;
    }

    iniciar() {
        this._escolherPalavra();
        this._configurarTeclado();

        console.info(this.palavraEscolhida);
    }

    reset() {
        this._escolherPalavra();
        this._monitorAtualDaLetra = [0, 0];
        this._limparMonitoresDeLetras();
    }

    _alertar(mensagem) {
        let container = document.querySelector("#container-alerta");
        let alerta = document.createElement("div");

        alerta.classList.add('alerta');
        alerta.innerHTML = mensagem;

        container.appendChild(alerta);
        setTimeout(() => {
            container.removeChild(alerta);
        }, 1500);
    }

    _getQueryMonitor(linha, letra) {
        return `.linha${linha} > .letra${letra}`;
    }

    _getMonitorLetra(linha, letra) {
        let query = this._getQueryMonitor(linha, letra);
        return document.querySelector(query);
    }

    _configurarMonitorAtualDaLetra(linha, letra) {
        let novoValor = [linha, letra];
        this.monitoresDasLetras = novoValor
    }

    _limparMonitoresDeLetras() {
        let monitoresDasLetras = document.querySelectorAll('.letra');

        monitoresDasLetras.forEach((element) => {
            element.innerHTML = '';
            element.classList.remove(this.classeCSSLetraDigitada);
        });
    }

    _escolherPalavra() {
        let palavras = new dicionario();
        this._palavraEscolhida = palavras.escolherUmaPalavraAleatoriamente();
    }

    _exibirLetraNoMonitor(letra) {
        let elemento = this.elementoAtual;

        if (elemento != null) {
            elemento.innerHTML = letra;
            elemento.classList.toggle(this.classeCSSLetraDigitada);
        }
    }

    _apagarLetraNoMonitor() {
        let elemento = this.elementoAtual;
        if (elemento.classList.contains(this.classeCSSLetraDigitada)) {
            this._exibirLetraNoMonitor("");
        }
    }

    _pularLetraDoMonitor() {
        let letra = Math.min(this.letraAtual + 1, 5);
        this._configurarMonitorAtualDaLetra(this.linhaAtual, letra);
    }

    _retornarLetraDoMonitor() {
        let letra = Math.max(this.letraAtual - 1, 0);
        this._configurarMonitorAtualDaLetra(this.linhaAtual, letra);
    }

    _isPreencheuTodasAsLetrasDaLinha() {
        let linha = this.linhaAtual;

        for (let index = 0; index < 5; index++) {
            let elemento = this._getMonitorLetra(linha, index);

            if (elemento.innerHTML == "") {
                return false;
            }
        }

        return true;
    }

    _configurarTeclasNormais() {
        let teclas = document.querySelectorAll('.tecla');

        teclas.forEach((element) => {
            element.addEventListener('click', () => {
                let texto = element.innerHTML;
                this._exibirLetraNoMonitor(texto);
                this._pularLetraDoMonitor();
            });
        });
    }

    _configurarTeclaEnter() {
        let tecla = document.querySelector('.enter');

        tecla.addEventListener('click', () => {
            if (!this._isPreencheuTodasAsLetrasDaLinha())
                this._alertar("Preencha todas as letras!");
        });
    }

    _configurarTeclaApagar() {
        let tecla = document.querySelector('.apagar');

        tecla.addEventListener('click', () => {
            this._retornarLetraDoMonitor();
            this._apagarLetraNoMonitor();
        });
    }

    _configurarTeclado() {
        this._configurarTeclasNormais();
        this._configurarTeclaEnter();
        this._configurarTeclaApagar();
    }
}