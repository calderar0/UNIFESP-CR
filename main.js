document.addEventListener("DOMContentLoaded", () => {
    let materias = [];
    const materiaForm = document.getElementById('materia-form');
    const materiasContainer = document.getElementById('materiasContainer');
    const formTitle = document.getElementById('form-title');
    const formButton = document.getElementById('form-button');
    const cancelButton = document.getElementById('cancel-button');
    const materiaIdInput = document.getElementById('materia-id');

    fetch('dataBia.json')
        .then(response => response.json())
        .then(data => {
            materias = data.materias.map((materia, index) => ({ ...materia, id: index }));
            renderMaterias();
            calcularMediaPonderada();
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));

    function renderMaterias() {
        materiasContainer.innerHTML = '';
        materias.forEach(materia => {
            const div = document.createElement('div');
            div.className = 'materia-item';
            div.dataset.id = materia.id;

            div.innerHTML = `
                <div class="materia-info">
                    <strong>${materia.nome}</strong><br>
                    <span>Peso: ${materia.peso} | Nota: ${materia.nota}</span>
                </div>
                <div class="materia-actions">
                    <button class="edit">Editar</button>
                    <button class="delete">Remover</button>
                </div>
            `;
            materiasContainer.appendChild(div);
        });
    }

    function calcularMediaPonderada() {
        if (materias.length === 0) {
            document.getElementById('resultado').style.display = 'none';
            return;
        }

        let somaNotasPesos = 0;
        let somaPesos = 0;

        materias.forEach(materia => {
            somaNotasPesos += materia.nota * materia.peso;
            somaPesos += materia.peso;
        });

        const mediaPonderada = somaPesos > 0 ? somaNotasPesos / somaPesos : 0;
        exibirResultado(mediaPonderada);
    }

    function exibirResultado(media) {
        document.getElementById('resultado').style.display = 'block';
        document.getElementById('result').innerText = `Média Ponderada: ${media.toFixed(3)}`;
    }

    materiaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = materiaIdInput.value;
        const nome = document.getElementById('nome').value;
        const peso = parseFloat(document.getElementById('peso').value);
        const nota = parseFloat(document.getElementById('nota').value);

        if (id) {
            const index = materias.findIndex(m => m.id == id);
            if (index !== -1) {
                materias[index] = { ...materias[index], nome, peso, nota };
            }
        } else {
            const newId = materias.length > 0 ? Math.max(...materias.map(m => m.id)) + 1 : 0;
            materias.push({ id: newId, nome, peso, nota });
        }

        resetForm();
        renderMaterias();
        calcularMediaPonderada();
    });

    materiasContainer.addEventListener('click', (e) => {
        const id = e.target.closest('.materia-item').dataset.id;
        if (e.target.classList.contains('delete')) {
            materias = materias.filter(m => m.id != id);
            renderMaterias();
            calcularMediaPonderada();
        } else if (e.target.classList.contains('edit')) {
            const materia = materias.find(m => m.id == id);
            if (materia) {
                document.getElementById('materia-id').value = materia.id;
                document.getElementById('nome').value = materia.nome;
                document.getElementById('peso').value = materia.peso;
                document.getElementById('nota').value = materia.nota;

                formTitle.innerText = 'Editar Matéria';
                formButton.innerText = 'Atualizar';
                cancelButton.style.display = 'inline-block';
            }
        }
    });

    cancelButton.addEventListener('click', () => {
        resetForm();
    });

    function resetForm() {
        materiaForm.reset();
        materiaIdInput.value = '';
        formTitle.innerText = 'Adicionar Matéria';
        formButton.innerText = 'Adicionar';
        cancelButton.style.display = 'none';
    }
});