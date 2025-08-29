const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

let salasDeAula = [
    { salasdeaulaid: 1, descricao: "Sala 101", localizacao: "Bloco A", capacidade: 30, removido: false },
    { salasdeaulaid: 2, descricao: "Laboratório de Informática", localizacao: "Bloco B", capacidade: 25, removido: false },
    { salasdeaulaid: 3, descricao: "Auditório", localizacao: "Bloco C", capacidade: 150, removido: true },
    { salasdeaulaid: 4, descricao: "Sala 203", localizacao: "Bloco A", capacidade: 40, removido: false },
];

let proximoId = 5;

app.get('/', (req, res) => {
    res.status(200).send('<h1>API de Salas de Aula está funcionando!</h1><p>Acesse /salasdeaula para ver os dados.</p>'
    +'<p>Acesse /salasdeaula/:id para achar um específico </p><p>Acesse /salasdeaula com post para adicionar os dados.</p>'
    + '<p>Acesse /salasdeaula/:id com delete para deletar os dados.</p>');
});

app.get('/salasdeaula', (req, res) => {
    const salasAtivas = salasDeAula.filter(sala => !sala.removido);
    res.status(200).json(salasAtivas);
});

app.get('/salasdeaula/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sala = salasDeAula.find(s => s.salasdeaulaid === id && !s.removido);

    if (sala) {
        res.status(200).json(sala);
    } else {
        res.status(404).json({ message: 'Sala de aula não encontrada ou foi removida.' });
    }
});

app.post('/salasdeaula', (req, res) => {
    const { descricao, localizacao, capacidade } = req.body;

    if (!descricao || !localizacao || !capacidade) {
        return res.status(400).json({ message: 'Descrição, localização e capacidade são campos obrigatórios.' });
    }

    const novaSala = {
        salasdeaulaid: proximoId++,
        descricao: descricao,
        localizacao: localizacao,
        capacidade: capacidade,
        removido: false
    };

    salasDeAula.push(novaSala);
    res.status(201).json(novaSala);
});

app.put('/salasdeaula/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, localizacao, capacidade } = req.body;

    const salaIndex = salasDeAula.findIndex(s => s.salasdeaulaid === id);

    if (salaIndex === -1) {
        return res.status(404).json({ message: 'Sala de aula não encontrada.' });
    }

    salasDeAula[salaIndex].descricao = descricao || salasDeAula[salaIndex].descricao;
    salasDeAula[salaIndex].localizacao = localizacao || salasDeAula[salaIndex].localizacao;
    salasDeAula[salaIndex].capacidade = capacidade || salasDeAula[salaIndex].capacidade;

    res.status(200).json(salasDeAula[salaIndex]);
});

app.delete('/salasdeaula/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const salaIndex = salasDeAula.findIndex(s => s.salasdeaulaid === id);

    if (salaIndex === -1) {
        return res.status(404).json({ message: 'Sala de aula não encontrada.' });
    }

    salasDeAula[salaIndex].removido = true;

    res.status(200).json({ message: 'Sala de aula removida com sucesso (soft delete).' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});