function generateMateriaSelection() {
    const numMaterias = document.getElementById('numMaterias').value;
    const container = document.getElementById('materiasContainer');
    container.innerHTML = ''; // Limpa os campos anteriores
    
    if (numMaterias > 50 || numMaterias < 1 || isNaN(numMaterias)) {
        document.getElementById('invalid').style.display = 'block';
        document.getElementById('materiaForm').style.display = 'none';
        document.getElementById('mediaForm').style.display = 'none';
        document.getElementById('resultado').style.display = 'none';
        return;
    }
    else {
        document.getElementById('invalid').style.display = 'none';
    }
    
    arrumaLayout();

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < numMaterias; i++) {
                const div = document.createElement('div');
                div.className = 'input-group';
                const select = document.createElement('select');
                select.name = 'materia';
                data.materias.forEach(materia => {
                    const option = document.createElement('option');
                    option.value = JSON.stringify(materia);
                    option.text = materia.nome;
                    select.appendChild(option);
                });
                div.innerHTML = `
                    <label>Matéria ${i+1}: </label>
                `;
                div.appendChild(select);
                container.appendChild(div);
            }
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}

function saveMaterias() {
    const materias = document.getElementsByName('materia');
    const data = [];

    for (let i = 0; i < materias.length; i++) {
        const materia = JSON.parse(materias[i].value);
        data.push(materia);
    }

    generateNotaFields(data);
}

function generateNotaFields(data) {
    const container = document.getElementById('inputsContainer');
    container.innerHTML = ''; // Limpa os campos anteriores

    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>${item.nome}: <input type="number" name="nota" step="0.01" data-peso="${item.peso}"></label>
        `;
        container.appendChild(div);
    });

    document.getElementById('mediaForm').style.display = 'block';
}

function calculateAverage() {
    const notas = document.getElementsByName('nota');
    let somaNotasPesos = 0;
    let somaPesos = 0;

    for (let i = 0; i < notas.length; i++) {
        const nota = parseFloat(notas[i].value);
        const peso = parseFloat(notas[i].getAttribute('data-peso'));
        somaNotasPesos += nota * peso;
        somaPesos += peso;
    }

    const mediaPonderada = somaNotasPesos / somaPesos;
    document.getElementById('result').style.display = 'block';
    document.getElementById('resultado').style.display = 'flex';
    document.getElementById('result').innerText = `Média Ponderada: ${mediaPonderada.toFixed(3)}`;
}

function esconderMat(){
    document.getElementById('materiaForm').style.display = 'none';
}

function arrumaLayout(){
    document.getElementById('mediaForm').style.display = 'none';
    document.getElementById('materiaForm').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('resultado').style.display = 'none';
}