console.log("entrou no meu script")

const quizz =
{
    nome: "Quiz sobre Harry Potter",
    perguntas: [{
        pegunta: "Qual era a casa de Cedrico?",
        name: 'q1',
        respostas: [
            { value: "r1", resposta: "Grifinoria", certo: false },
            { value: "r2", resposta: "Sonserina", certo: false },
            { value: "r3", resposta: "Lufa lufa", certo: true },
            { value: "r4", resposta: "Corvinal", certo: false },
        ]
    },
    {
        pegunta: "Sirius era oque do Harry?",
        name: 'q2',
        respostas: [
            { value: "r1", resposta: "Pai", certo: false },
            { value: "r2", resposta: "Avô", certo: false },
            { value: "r3", resposta: "Padrinho", certo: true },
            { value: "r4", resposta: "Melhor amigo", certo: false },
        ]
    },
    {
        pegunta: "Quem era o melhor amigo do Harry?",
        name: 'q3',
        respostas: [
            { value: "r1", resposta: "Draco", certo: false },
            { value: "r2", resposta: "Simas", certo: false },
            { value: "r3", resposta: "Ronald", certo: true },
            { value: "r4", resposta: "Cedrico", certo: false },
        ]
    },
    {
        pegunta: "Quem foi o vilão do 4º filme/livro?",
        name: 'q4',
        respostas: [
            { value: "r1", resposta: "Olho tonto Moody", certo: false },
            { value: "r2", resposta: "Igor Karkaroff", certo: false },
            { value: "r3", resposta: "Barto Crouch JR", certo: true },
            { value: "r4", resposta: "Barto Crouch", certo: false },
        ]
    },
    {
        pegunta: "Quantos horcrux Voldemort criou?",
        name: 'q5',
        respostas: [
            { value: "r1", resposta: "4", certo: false },
            { value: "r2", resposta: "9", certo: false },
            { value: "r3", resposta: "7", certo: true },
            { value: "r4", resposta: "5", certo: false },
        ]
    }]
}

document.addEventListener('DOMContentLoaded', () => {
    createQuestions()

    // Listener para o envio do formulário
    document.getElementById('form_harry').addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('event:', e);
        form = new FormData(e.currentTarget)
        const respostasDoUsuario = form.entries()
        validaRespostas(respostasDoUsuario)
    });
});






function createQuestions() {
    console.log("Criando formulario")
    const container = document.getElementById('form_harry')
    const h1 = document.createElement('h1');
    h1.innerText = quizz.nome
    container.appendChild(h1);
    quizz.perguntas.forEach(pergunta => {
        const itemDiv = document.createElement('div');
        const itemP = document.createElement('p');
        const itemUl = document.createElement('ul');
        itemP.innerText = pergunta.pegunta
        itemDiv.appendChild(itemP)
        itemDiv.appendChild(itemUl)
        pergunta.respostas.forEach(
            resposta => {
                const itemLi = document.createElement('li');
                const input = document.createElement('input');
                const label = document.createElement('label');
                input.type = 'radio'
                input.name = pergunta.name
                input.value = resposta.value
                label.innerText = resposta.resposta
                itemLi.appendChild(input)
                itemLi.appendChild(label)
                itemUl.appendChild(itemLi)
            }
        )
        container.appendChild(itemDiv)
    })
    const itemButton = document.createElement('button')
    itemButton.innerText = "Enviar respostas"
    itemButton.type = "submit"
    container.appendChild(itemButton)
}

function validaRespostas(respostasDoUsuario) {
    respostas = {}
    acertos = 0
    quantidade_perguntas = 0
    for (let [key, value] of respostasDoUsuario) {
        quantidade_perguntas++
        respostas[key] = value
        console.log("key: ", key)
        console.log("value: ", value)
        console.log(quizz)
        const pergunta = quizz.perguntas.find(
            item => item.name == key
        )
        if (pergunta) {
            const resposta = pergunta.respostas.find(
                item => item.value == value
            )
            if (resposta.certo) {
                acertos++
            }

        }

    }



    window.location.href = `resultado.html?quantidade_acertada=${acertos}&quantidade_perguntas=${quantidade_perguntas}`

}
