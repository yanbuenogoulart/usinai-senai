let primeiraCarta = null
let segundaCarta = null
let bloqueio = false
let pontuacao = 0
let totalPares

function virarCarta(event) {
    if (bloqueio) return

    const carta = event.currentTarget
    const imagem = carta.querySelector('img')

    if (imagem.style.display === 'block') return

    carta.style.transition = 'transform 0.6s'
    carta.style.transform = 'scaleX(-1)'

    imagem.style.display = 'block'
    imagem.style.transition = 'transform 0.6s'
    imagem.style.transform = 'scaleX(-1)'

    if (!primeiraCarta) {
        primeiraCarta = carta
    } else {
        segundaCarta = carta
        compararCartas()
    }
}

function compararCartas() {
    bloqueio = true
    const srcPrimeiraCarta = primeiraCarta.querySelector('img').getAttribute('src')
    const srcSegundaCarta = segundaCarta.querySelector('img').getAttribute('src')

    if (srcPrimeiraCarta === srcSegundaCarta) {
        setTimeout(() => {
            primeiraCarta.style.pointerEvents = 'none'
            segundaCarta.style.pointerEvents = 'none'
            pontuacao++
            document.getElementById('pontos').textContent = pontuacao

            if (pontuacao === totalPares) {
                piscarCartasFinal()
            } else {
                resetarCartas()
            }
        }, 600)
    } else {
        setTimeout(() => {
            primeiraCarta.style.transform = ''
            segundaCarta.style.transform = ''
            primeiraCarta.querySelector('img').style.display = 'none'
            segundaCarta.querySelector('img').style.display = 'none'
            resetarCartas()
        }, 1000)
    }
}

function resetarCartas() {
    primeiraCarta = null
    segundaCarta = null
    bloqueio = false
}

function piscarCartasFinal() {
    const cartas = document.querySelectorAll('.areaJogo div')
    let contador = 0

    const intervaloPiscar = setInterval(() => {
        for (let i = 0; i < cartas.length; i++) {
            if (contador % 2 === 0) {
                cartas[i].style.visibility = 'hidden'
            } else {
                cartas[i].style.visibility = 'visible'
            }
        }
        contador++

        if (contador === 12) {
            clearInterval(intervaloPiscar)
            setTimeout(() => {
                alert('Parabéns! Você completou o jogo!')
                reiniciarJogo()
            }, 200)
        }
    }, 300)
}

function reiniciarJogo() {
    const areaJogo = document.getElementById('areaJogo')
    while (areaJogo.firstChild) {
        areaJogo.removeChild(areaJogo.firstChild)
    }

    pontuacao = 0
    document.getElementById('pontos').textContent = pontuacao
    primeiraCarta = null
    segundaCarta = null
    bloqueio = false

    const dim = obterDimensao()
    totalPares = (dim * dim) / 2
    criarGrid(dim)
}

function obterDimensao() {
    return Number(document.getElementById('dimensao').value)
}

function sortearNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function embaralharCarta(carta) {
    for (let i = carta.length - 1; i > 0; i--) {
        const j = sortearNum(0, i)
        const temp = carta[i]
        carta[i] = carta[j]
        carta[j] = temp
    }
}

function criarGrid(dim) {
    const areaJogo = document.getElementById('areaJogo')
    areaJogo.style.display = 'grid'
    areaJogo.style.padding = '20px'
    areaJogo.style.gridTemplateColumns = `repeat(${dim}, 7.5vw)`
    areaJogo.style.gridTemplateRows = `repeat(${dim}, 7.5vw)`
    areaJogo.style.gap = '15px'
    areaJogo.innerHTML = ''

    let cartaBase = document.createElement('div')
    cartaBase.style.width = '7.5vw'
    cartaBase.style.height = '7.5vw'
    cartaBase.style.border = 'solid 4px #135fc2'
    cartaBase.style.borderRadius = '4px'
    cartaBase.style.backgroundColor = '#007bff'
    cartaBase.style.cursor = 'pointer'

    let imagemBase = document.createElement('img')
    imagemBase.style.width = '100%'
    imagemBase.style.height = '100%'
    imagemBase.style.objectFit = 'cover'
    imagemBase.style.display = 'none'

    let imagemUrl = []
    for (let i = 0; i < (dim * dim) / 2; i++) {
        imagemUrl.push(`./imagens/${i + 1}j.jpg`)
        imagemUrl.push(`./imagens/${i + 1}j.jpg`)
    }

    embaralharCarta(imagemUrl)

    for (let i = 0; i < dim * dim; i++) {
        let carta = cartaBase.cloneNode(true)
        let imagem = imagemBase.cloneNode(true)
        imagem.setAttribute('src', imagemUrl[i])
        carta.appendChild(imagem)
        areaJogo.appendChild(carta)
        carta.addEventListener('click', virarCarta)
    }
}

function jogar() {
    reiniciarJogo()
}