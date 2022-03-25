let jogo = class {
    _palavraEscolhida = "";
    _monitorAtualDaLetra = [0, 0];
    _dicionario = {};

    constructor() {
        this._dicionario = new dicionarioPalavras();
    }

    get dicionario() {
        return this._dicionario;
    }

    get palavraEscolhida() {
        return this._palavraEscolhida;
    }

    get palavraEscolhidaSemCaracterEspecial() {
        return this.palavraEscolhida;
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

    get classeCSSLetraErrada() {
        return "letraErrada";
    }

    get classseCSSLetraCertaNoLugarCerto() {
        return "letraCertaNoLugarCerto";
    }

    get classeCSSLetraCertaNoLugarErrado() {
        return "letraCertaNoLugarErrado";
    }

    set monitoresDasLetras(valor) {
        this._monitorAtualDaLetra = valor;
    }

    iniciar() {
        this._escolherPalavra();
        this._configurarTeclado();
    }

    reset() {
        this._escolherPalavra();
        this._monitorAtualDaLetra = [0, 0];
        this._limparMonitoresDeLetras();
    }

    delay(callback, tempo) {
        setTimeout(() => {
            callback();
        }, tempo);
    }

    _alertar(mensagem) {
        let container = document.querySelector("#container-alerta");
        let alerta = document.createElement("div");

        alerta.classList.add('alerta');
        alerta.innerHTML = mensagem;

        container.appendChild(alerta);
        this.delay(() => {
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

    _getLetra(linha, letra) {
        let monitor = this._getMonitorLetra(linha, letra);
        return monitor.innerHTML;
    }

    _configurarMonitorAtualDaLetra(linha, letra) {
        let novoValor = [linha, letra];
        this.monitoresDasLetras = novoValor;
    }

    _limparMonitoresDeLetras() {
        let monitoresDasLetras = document.querySelectorAll('.letra');

        monitoresDasLetras.forEach((element) => {
            element.innerHTML = '';
            element.classList.remove(
                this.classeCSSLetraDigitada,
                this.classeCSSLetraErrada,
                this.classseCSSLetraCertaNoLugarCerto,
                this.classeCSSLetraCertaNoLugarErrado
            );
        });
    }

    _escolherPalavra() {
        this._palavraEscolhida = this.dicionario.escolherUmaPalavraAleatoriamente();
        console.info(this.palavraEscolhida);
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

    _contemLetraNaPalavraEscolhida(letra) {
        let palavra = this.palavraEscolhidaSemCaracterEspecial;
        return (palavra.indexOf(letra) > -1);
    }

    _posicaoDaLetraNaPalavraEscolhida(letra) {
        let palavra = this.palavraEscolhidaSemCaracterEspecial;
        return palavra.indexOf(letra);
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
            let palavraDigitada = "";

            if (!this._isPreencheuTodasAsLetrasDaLinha()) {
                this._alertar("Preencha todas as letras!");
                return;
            }

            for (let index = 0; index < 5; index++) {
                let linha = this.linhaAtual;
                let letra = this._getLetra(linha, index);

                palavraDigitada += letra;
            }

            if (!this.dicionario.isPalavraValida(palavraDigitada)) {
                this._alertar("Palavra inválida!");
                return;
            }

            for (let index = 0; index < 5; index++) {
                let linha = this.linhaAtual;
                let letra = this._getLetra(linha, index);
                let monitor = this._getMonitorLetra(linha, index);

                if (this._contemLetraNaPalavraEscolhida(letra)) {
                    let posicaoDaLetra = this._posicaoDaLetraNaPalavraEscolhida(letra);

                    if (posicaoDaLetra == index) {
                        monitor.classList.add(this.classseCSSLetraCertaNoLugarCerto);
                    } else {
                        monitor.classList.add(this.classeCSSLetraCertaNoLugarErrado);
                    }

                } else {
                    monitor.classList.add(this.classeCSSLetraErrada);
                }
            }

            if (palavraDigitada == this.palavraEscolhidaSemCaracterEspecial) {
                this._alertar(`${this.palavraEscolhida.toUpperCase()}, Você acertou!`);
                this.delay(() => {
                    this.reset();
                }, 1500);
            } else {
                this._pularLetraDoMonitor();
            }

            if (this.linhaAtual == 5 && this.letraAtual == 0) {
                this._alertar(this.palavraEscolhida.toUpperCase());
                this.delay(() => {
                    this.reset();
                }, 1500);
            }
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